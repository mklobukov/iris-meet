import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from './meet-toolbar';
import HorizontalWrapper from './horizontal-wrapper';
import HorizontalBox from './horizontal-box';
import LoginPanel from './login-panel';
import UserActions from '../actions/user-actions';
import UserStore from '../stores/user-store';
import UserStoreConstants from '../constants/user-store-constants';
import VideoControlStore from '../stores/video-control-store';
import VideoControlStoreConstants from '../constants/video-control-store-constants';
import VideoControlActions from '../actions/video-control-actions';
import { withRouter } from 'react-router';
import withWebRTC, { LocalVideo, RemoteVideo, WebRTCConstants } from 'iris-react-webrtc';
import Config from '../../config.json';
import getQueryParameter from '../utils/query-params';
import validResolution from '../utils/verify-resolution';
import TextChat from './text-chat';
import MessageActions from '../actions/message-actions';
import MessageConstants from '../constants/message-constants';
import MessageStore from '../stores/message-store';

export default withWebRTC(withRouter(class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoom: false,
      showUser: false,
      mainVideoConnection: {
        connection: null,
        type: '',
      },
      isVideoMuted: false,
      isVideoBarHidden: false,
      isToolbarHidden: false,
      isChatHidden: true,
      isChatAvailable: false,
      numberOfNewMessages: 0,
    }

    this.loginCallback = this._userLoggedIn.bind(this);
    this.loginFailedCallback = this._userFailedLogin.bind(this);
    this.mainVideoChangeCallback = this._onMainVideoChange.bind(this);
    this.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
    this.onLocalVideo = this._onLocalVideo.bind(this);
    this.onRemoteVideo = this._onRemoteVideo.bind(this);
    this.onParticipantLeft = this._onParticipantLeft.bind(this);
    this.onSessionCreated = this._onSessionCreated.bind(this);
    this.onChatRoomReady = this._onChatRoomReady.bind(this);
    this.onNewMessageArrived = this._onNewMessageArrived.bind(this);

    this.timer = setTimeout(() => {
      this.setState({
        isToolbarHidden: true,
      });
    }, 10000);
  }

  componentDidMount() {
    UserStore.addUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
    UserStore.addUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
    VideoControlStore.addVideoControlListener(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT, this.mainVideoChangeCallback);
    MessageStore.addMessageListener(MessageConstants.ROOM_READY_EVENT, this.onChatRoomReady);
    MessageStore.addMessageListener(MessageConstants.NEW_MESSAGE_ARRIVED_EVENT, this.onNewMessageArrived);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_SESSION_CREATED, this.onSessionCreated);
    const requestedResolution = getQueryParameter('resolution');
    console.log(requestedResolution);
    console.log('roomName: ' + this.props.params.roomname);
    let showRoom = false;
    let showUser = false;
    if (this.props.params.roomname === undefined) {
      // no room name specified in URL so show dialog
      // to ask for room name
      showRoom = true;
    }

    const userName = localStorage.getItem('irisMeet.userName');
    if (userName === null) {
      // we do not have user name stored so ask for user name
      showUser = true;
    }

    if (showRoom || showUser) {
      this.setState({
        showRoom,
        showUser,
      });
    } else {
      // we have both userName and roomName so login
      // we should also have routingId but just in case
      // we don't create one
      let routingId = localStorage.getItem('irisMeet.routingId');
      if (routingId === null) {
        routingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
        localStorage.setItem('irisMeet.routingId', routingId);
      }
      UserActions.loginUser(userName, routingId, this.props.params.roomname);
    }
  }

  componentWillUnmount() {
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_SESSION_CREATED, this.onSessionCreated);
    UserStore.removeUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
    UserStore.removeUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
    VideoControlStore.removeVideoControlListener(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT, this.mainVideoChangeCallback);
    MessageStore.removeMessageListener(MessageConstants.ROOM_READY_EVENT, this.onChatRoomReady);
    MessageStore.removeMessageListener(MessageConstants.NEW_MESSAGE_ARRIVED_EVENT, this.onNewMessageArrived);
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      UserActions.leaveRoom();
      //this.endSession();
    });
  }

  _onNewMessageArrived(numberOfNewMessages) {
    if (this.state.isChatHidden) {
      this.setState({
        numberOfNewMessages: numberOfNewMessages,
      }, () => {
        this._onMouseMove();  // wake up toolbar to show up so the user can
                              // see notification
      });
    } else {
      this.setState({
        numberOfNewMessages: 0,
      });
    }
  }

  _onSessionCreated(sessionInfo) {
    MessageActions.roomReady(UserStore.token, UserStore.user, UserStore.room, UserStore.userRoutingId,
      this.props.getRootNodeId(), this.props.getRootChildNodeId());
  }

  _onChatRoomReady() {
    this.setState({
      isChatAvailable: true,
    });
  }

  _onLocalVideo(videoInfo) {
    console.log('NUMBER OF LOCAL VIDEOS: ' + this.props.localVideos.length);
    if (this.props.localVideos.length > 0) {
      VideoControlActions.changeMainView('local', this.props.localVideos[0].video.index);
    }
  }

  _onRemoteVideo(videoInfo) {
    console.log('NUMBER OF REMOTE VIDEOS: ' + this.props.remoteVideos.length);
    if (this.props.remoteVideos.length === 1) {
      VideoControlActions.changeMainView('remote', this.props.remoteVideos[0].video.index);
    }
  }

  _onParticipantLeft(id) {
    console.log('Remote participant left: ' + id);
    if (this.props.remoteVideos.length === 0) {
      if (this.props.localVideos.length > 0) {
        // no participants so go back to local video
        console.log('Remote participant back to local');
        VideoControlActions.changeMainView('local', this.props.localVideos[0].video.index);
      }
    }

    if (this.state.mainVideoConnection.connection &&
        this.state.mainVideoConnection.connection.track &&
        this.state.mainVideoConnection.connection.track.getParticipantId() === id) {
      if (this.props.localVideos.length > 0) {
        // if the participant who left was on main screen replace it with local
        // video
        VideoControlActions.changeMainView('local', this.props.localVideos[0].video.index);
      }
    }
  }

  _onDominantSpeakerChanged(dominantSpeakerEndpoint) {
    console.log('DOMINANT_SPEAKER_CHANGED: ' + dominantSpeakerEndpoint);
    //let participant = track.getParticipantId();
    //let baseId = participant.replace(/(-.*$)|(@.*$)/,'');
    const matchedConnection = this.props.remoteVideos.find((connection) => {
      const participantId = connection.track.getParticipantId();
      console.log('participantId: ' + participantId);
      const endPoint = participantId.substring(participantId.lastIndexOf("/") + 1);
      return endPoint === dominantSpeakerEndpoint;
    });

    console.log('FOUND DOMINANT SPEAKER: ');
    console.log(matchedConnection);
    if (matchedConnection) {
      VideoControlActions.changeMainView('remote', matchedConnection.video.index);
    } else if (this.props.localVideos.length > 0) {
      // no remote participants found so assume it is local speaker
      //VideoControlActions.changeMainView('local', this.props.localVideos[0].video.index);
    }
  }

  _onMainVideoChange() {
    console.log('Video type: ' + VideoControlStore.videoType);
    console.log('Video index: ' + VideoControlStore.videoIndex);

    if (VideoControlStore.videoType === 'local') {
      const mainConnection = this.props.localVideos.find((connection) => {
        return connection.video.index === VideoControlStore.videoIndex;
      });
      this.setState({
        mainVideoConnection: {
        connection: mainConnection,
        type: 'local',
      }}, () => {
        console.log('MainVideo: local');
      });
    } else {
      const mainConnection = this.props.remoteVideos.find((connection) => {
        return connection.video.index === VideoControlStore.videoIndex;
      });
      this.setState({
        mainVideoConnection: {
        connection: mainConnection,
        type: 'remote',
      }}, () => {
        console.log('MainVideo: remote:' + mainConnection.baseId);
      });
    }
  }

  _userLoggedIn() {
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      let requestedResolution = getQueryParameter('resolution');
      console.log(requestedResolution);
      if (!validResolution(requestedResolution)) {
        console.log('Requested resolution is not valid.  Switching to default hd.');
        requestedResolution = 'hd';
      }
      const hosts = {
        eventManagerUrl: Config.eventManagerUrl,
        notificationServer: Config.notificationServer,
        nodeServer: Config.nodeServer
      }
      const routingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
      this.props.initializeWebRTC(UserStore.user, routingId, UserStore.room, UserStore.domain.toLowerCase(), hosts, UserStore.token, requestedResolution);
    });
  }

  _userFailedLogin(error) {
    // TODO: login error handler
    console.log('Login failure: ');
    console.log(error);
  }

  _onLoginPanelComplete(e) {
    e.preventDefault();
    //e.stopPropagation();
    let routingId = localStorage.getItem('irisMeet.routingId');
    if (routingId === null) {
      routingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
      localStorage.setItem('irisMeet.routingId', routingId);
    }
    const userName = this.refs.loginpanel.userName ? this.refs.loginpanel.userName : localStorage.getItem('irisMeet.userName');
    const roomName = this.refs.loginpanel.roomName ? this.refs.loginpanel.roomName : this.props.params.roomname;
    localStorage.setItem('irisMeet.userName', userName);
    const hostname = window.location.origin;
    window.location.assign(hostname + '/' + roomName);
  }

  _onLocalAudioMute(isMuted) {
    this.props.onAudioMute();
  }

  _onLocalVideoMute(isMuted) {
    console.log('video muted: ' + isMuted);
    this.setState({
      isVideoMuted: isMuted,
    }, () => {
      this.props.onVideoMute();
    });
  }

  _onExpandHide() {
    this.setState({
      isVideoBarHidden: !this.state.isVideoBarHidden,
    });
  }

  _onMouseMove() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.state.isToolbarHidden === false) {
      this.timer = setTimeout(() => {
        this.setState({
          isToolbarHidden: true,
        });
      }, 10000);
    } else {
      this.setState({
        isToolbarHidden: false,
      }, () => {
        this.timer = setTimeout(() => {
          this.setState({
            isToolbarHidden: true,
          });
        }, 10000);
      });
    }
  }

  _onHangup() {
    this.props.endSession();
    const hostname = window.location.href;
    const urlString = hostname.substring(0, hostname.lastIndexOf("/"));
    window.location.assign(urlString);
  }

  _onChat() {
    if (!this.state.isChatAvailable) {
      return;
    }
    MessageActions.resetNewMessageCount();
    this.setState({
      isChatHidden: !this.state.isChatHidden,
    });
    this.setState({
      numberOfNewMessages: 0,
    });
  }

  render() {
    return (
      <div onMouseMove={this._onMouseMove.bind(this)}>
      {this.props.localVideos.length > 0 ?
        <MeetToolbar
          isHidden={this.state.isToolbarHidden}
          isChatAvailable={this.state.isChatAvailable}
          newMessageCount={this.state.numberOfNewMessages}
          onMicrophoneMute={this._onLocalAudioMute.bind(this)}
          onCameraMute={this._onLocalVideoMute.bind(this)}
          onExpandHide={this._onExpandHide.bind(this)}
          onHangup={this._onHangup.bind(this)}
          onChat={this._onChat.bind(this)}
        /> : null}
      <MainVideo>
        {this.state.mainVideoConnection.type === 'remote' ?
          <RemoteVideo
            video={this.state.mainVideoConnection.connection.video}
            audio={this.state.mainVideoConnection.connection.audio}
          /> : null
        }
        {this.state.mainVideoConnection.type === 'local' ?
          <LocalVideo
            video={this.state.mainVideoConnection.connection.video}
            audio={this.state.mainVideoConnection.connection.audio}
          /> : null
        }
      </MainVideo>
      <HorizontalWrapper isHidden={this.state.isVideoBarHidden}>
          {this.props.localVideos.map((connection) => {
            console.log('LOCAL CONNECTION');
            console.log(connection);
            return (
              <HorizontalBox
                key={connection.video.index}
                type='local'
                id={connection.video.index}
              >
                <LocalVideo key={connection.video.index} video={connection.video} audio={connection.audio} />
              </HorizontalBox>
            );
          })}
          {this.props.remoteVideos.map((connection) => {
            console.log('REMOTE CONNECTION');
            console.log(connection);
            console.log(connection.track.getParticipantId());
            if (connection.video) {
              return (
                <HorizontalBox
                  key={connection.video.index}
                  type='remote'
                  id={connection.video.index}
                >
                  <RemoteVideo key={connection.video.index} video={connection.video} audio={connection.audio} />
                </HorizontalBox>
              );
            }
          })}
      </HorizontalWrapper>
      <TextChat isHidden={this.state.isChatHidden} />
      {this.state.showUser || this.state.showRoom ?
        <LoginPanel
          ref='loginpanel'
          showRoom={this.state.showRoom}
          showUser={this.state.showUser}
          onAction={this._onLoginPanelComplete.bind(this)}
        /> : null}
      </div>
    );
  }
}));
