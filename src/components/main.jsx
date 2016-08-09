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

export default withWebRTC(withRouter(class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoom: false,
      showUser: false,
      mainVideoConnection: {
        connection: null,
        type: '',
      }
    }

    this.loginCallback = this._userLoggedIn.bind(this);
    this.loginFailedCallback = this._userFailedLogin.bind(this);
    this.mainVideoChangeCallback = this._onMainVideoChange.bind(this);
    this.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
    this.onLocalVideo = this._onLocalVideo.bind(this);
    this.onRemoteVideo = this._onRemoteVideo.bind(this);
    this.onParticipantLeft = this._onParticipantLeft.bind(this);
  }

  componentDidMount() {
    UserStore.addUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
    UserStore.addUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
    VideoControlStore.addVideoControlListener(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT, this.mainVideoChangeCallback);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
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
      UserActions.loginUser(userName, this.props.params.roomname);
    }
  }

  componentWillUnmount() {
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
    UserStore.removeUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
    UserStore.removeUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
    VideoControlStore.addVideoControlListener(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT, this.mainVideoChangeCallback);
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      UserActions.leaveRoom();
      this.endSession();
    });
  }

  _onLocalVideo(videoInfo) {
    if (this.props.localVideos.length > 0) {
      VideoControlActions.changeMainView('local', this.props.localVideos[0].video.index);
    }
  }

  _onRemoteVideo(videoInfo) {
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

    if (this.state.mainVideoConnection.connection.track.getParticipantId() === id) {
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
      VideoControlActions.changeMainView('local', this.props.localVideos[0].video.index);
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
      this.props.initializeWebRTC(UserStore.user, UserStore.room, UserStore.domain, UserStore.token);
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
    let userName = this.refs.loginpanel.userName ? this.refs.loginpanel.userName : localStorage.getItem('irisMeet.userName');
    let roomName = this.refs.loginpanel.roomName ? this.refs.loginpanel.roomName : this.props.params.roomname;
    localStorage.setItem('irisMeet.userName', userName);
    //UserActions.loginUser(userName, roomName);
    //this.props.router.push('/' + roomName);
    const hostname = window.location.href;
    const newLocation = hostname + roomName;
    window.location.assign(hostname + roomName);
  }

  render() {
    return (
      <div>
      <MeetToolbar />
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
      <HorizontalWrapper>
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
