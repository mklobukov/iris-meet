import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from '../containers/meet-toolbar';
import HorizontalWrapper from './horizontal-wrapper';
import HorizontalBox from '../containers/horizontal-box';
import BlackBox from '../containers/black-box'
import LoginPanel from '../containers/login-panel';
import { withRouter } from 'react-router';
import withWebRTC, { LocalVideo, RemoteVideo, WebRTCConstants } from 'iris-react-webrtc';
import Config from '../../config.json';
import getQueryParameter from '../utils/query-params';
import validResolution from '../utils/verify-resolution';
import { getRoomId } from '../api/RoomId';
import './style.css';
import { changeMainView, changeDominantSpeaker } from '../actions/video-control-actions';
import { connect } from 'react-redux';
import { loginUserAsync, leaveRoom } from '../actions/user-actions';

const authUrl = Config.authUrl;
const appKey = Config.appKey;

const mapStateToProps = (state) => {
  return {
    videoIndex: state.videoReducer.videoIndex,
    videoType: state.videoReducer.videoType,
    connection: state.videoReducer.connection,
    userName: state.userReducer.userName,
    routingId: state.userReducer.routingId,
    roomName: state.userReducer.roomName,
    accessToken: state.userReducer.accessToken,
    decodedToken: state.userReducer.decodedToken,
    dominantSpeakerIndex: state.videoReducer.dominantSpeakerIndex
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    VideoControl: (videoType, videoIndex, localVideos, remoteVideos) => {
      dispatch(changeMainView(videoType, videoIndex,
                                        localVideos, remoteVideos ))
    },
    loginUserAsync: (userName, routingId, roomName, authUrl, appKey) => {
      dispatch(loginUserAsync(userName, routingId, roomName, authUrl, appKey))
    },
    leaveRoom: () => {
      dispatch(leaveRoom())
    },
    changeDominantSpeaker: (dominantSpeakerIndex) => {
      dispatch(changeDominantSpeaker(dominantSpeakerIndex))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withWebRTC(withRouter(class Main extends React.Component {
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
      isSharingScreen: false
    }

    this.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
    this.onLocalVideo = this._onLocalVideo.bind(this);
    this.onRemoteVideo = this._onRemoteVideo.bind(this);
    this.onParticipantLeft = this._onParticipantLeft.bind(this);
    this.startScreenShare = this.props.startScreenshare.bind(this);
    this.endScreenshare = this.props.endScreenshare.bind(this);

    this.timer = setTimeout(() => {
      console.log('inside setTimeOut(), constructor')
      this.setState({
        isToolbarHidden: true,
      });
    }, 10000);
  }


  componentDidMount() {
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);

    //this.shareScreen()
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
      let routingId = null; //localStorage.getItem('irisMeet.routingId');
      if (routingId === null) {
        routingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v=c==='x' ? r : ((r & 0x3) | 0x8);
          return v.toString(16);
        });
        localStorage.setItem('irisMeet.routingId', routingId);
      }
      console.log(this.props.params.roomname)
      this.props.loginUserAsync(userName, routingId, this.props.params.roomname, authUrl, appKey)
    }
  }

componentWillReceiveProps = (nextProps) => {
  //Initially, the accessToken is undefined.
  //It receives a value when the user is logged in
  if (nextProps.accessToken !== this.props.accessToken) {
    this._userLoggedIn();
  }
}

  componentWillUnmount() {
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      this.props.leaveRoom();
    });
  }

  _onLocalVideo(videoInfo) {
    console.log('NUMBER OF LOCAL VIDEOS: ' + this.props.localVideos.length);
    if (this.props.localVideos.length > 0) {
      this.props.VideoControl('local', this.props.localVideos[0].id, this.props.localVideos, this.props.remoteVideos)
    }
  }

  _onRemoteVideo(videoInfo) {
    console.log('NUMBER OF REMOTE VIDEOS: ' + this.props.remoteVideos.length);
    if (this.props.remoteVideos.length === 1) {
      this.props.VideoControl('remote', this.props.remoteVideos[0].id, this.props.localVideos, this.props.remoteVideos)

    }
  }

  _onParticipantLeft(participantInfo) {
    console.log('Remote participant left: ', participantInfo);
    console.log(this.props.remoteVideos.length);
    if (this.props.remoteVideos.length === 0) {
      if (this.props.localVideos.length > 0) {
        // no participants so go back to local video
        console.log('Remote participant back to local');
        this.props.VideoControl('local', this.props.localVideos[0].id, this.props.localVideos, this.props.remoteVideos)
      }
    }

    if (this.state.mainVideoConnection.connection &&
        this.state.mainVideoConnection.connection.participantJid === participantInfo.participantJid) {
      if (this.props.localVideos.length > 0) {
        // if the participant who left was on main screen replace it with local
        // video
        this.props.VideoControl('local', this.props.localVideos[0].id, this.props.localVideos, this.props.remoteVideos)
      }
    }
  }

  _onDominantSpeakerChanged(dominantSpeakerEndpoint) {
    //let participant = track.getParticipantId();
    //let baseId = participant.replace(/(-.*$)|(@.*$)/,'');
    console.log("Got a new dominant speaker notification\nLooking through remotes...")

    //extract the part of dominantSpeakerEndpoint to use for comparison with connection id
    const dom = dominantSpeakerEndpoint.substring(0, dominantSpeakerEndpoint.lastIndexOf("@"));
    const matchedConnection = this.props.remoteVideos.find((connection) => {
      let participantId = connection.participantJid;
      participantId = participantId.substring(participantId.indexOf("/")+1, participantId.indexOf("@iris-meet.comcast.com"))
      const endPoint = participantId.substring(participantId.lastIndexOf("/")+1)
      console.log("endpoint and dom: " + endPoint + ", " + dom)
      return endPoint === dom;
      });

    if (matchedConnection) {
      console.log("New dominant speaker among remotes: ", matchedConnection.participantJid)
      //entering this if statement implies that the dominant speaker is remote
      //no further checks are necessary
      this.props.changeDominantSpeaker(matchedConnection.id)
      this.props.VideoControl('remote', matchedConnection.id, this.props.localVideos, this.props.remoteVideos)

    } else if (this.props.localVideos.length > 0) {
      console.log("Local speaker is dominant: ", this.props.localVideos[0])
      //no remote participants found so assume it is local speaker
      //change dominant speaker but don't change main view, keep displaying
      //the most recent remote dominant speaker
      this.props.changeDominantSpeaker(this.props.localVideos[0].id)
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
        requestedResolution = '640';
      }
      getRoomId(this.props.roomName, this.props.accessToken)
      .then((response) => {
        console.log(response);
        const roomId = response.room_id;
        this.props.initializeWebRTC(this.props.userName, this.props.routingId,
          this.props.roomName,
          roomId,
          this.props.decodedToken.payload['domain'].toLowerCase(),
          {
            eventManagerUrl: Config.eventManagerUrl,
            notificationServer: Config.notificationServer },
            this.props.accessToken,
            '640',
            true,
            true
          );
      })
    });
  }


//This is currently done in loginUserAsync()
  _userFailedLogin(error) {
    // TODO: login error handler
    console.log('Login failure: ');
    console.log(error);
  }

  _onLoginPanelComplete(e) {
    e.preventDefault();
    //e.stopPropagation();
    let routingId = null; //localStorage.getItem('irisMeet.routingId');
    if (routingId === null) {
      routingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v=c==='x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
      });
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
    const hostname = window.location.href;
    const urlString = hostname.substring(0, hostname.lastIndexOf("/"));
    window.location.assign(urlString);
  }

  _isDominant(index) {
    //console.log(index === this.props.dominantSpeakerIndex)
    return index === this.props.dominantSpeakerIndex;
  }


_shareScreen() {
   var constraints = {};
   console.log("window chrome: ", window.chrome)
   window.chrome.runtime.sendMessage(
     //NOTE: this ID will vary from client to client because
     //currently the desktop share extension is not on Chrome or
     //Firefox store yet. The ID may also update when the cache is cleared
       'omgaahegahkjnlogadbaadmoomfoflan', {
           // getVersion: true,
           getStream: true,
           sources: ['screen', 'window']
       },
       response => {
           if (!response) {
               const lastError = window.chrome.runtime.lastError;
               console.log(lastError);
           }
           console.log('Response from extension: ', response);

           //These constraints are not necessary,
           //they are being rebuilt inside startScreenShare function
           //But I'm leaving them here for now anyways
           constraints.audio = false;
           constraints.video = {
               mandatory: {
                   chromeMediaSource: "desktop",
                   chromeMediaSourceId: response.streamId,
                   maxWidth: window.screen.width,
                   maxHeight: window.screen.height,
                   maxFrameRate: 3
               },
               optional: []
           };
           //userConfig.switchStream = true;

           //var streamConfig = {
           //"constraints": constraints
           //}
           console.log("about to call start screen")
           //client.Session.switchStream(client.Stream, streamConfig);
           this.startScreenShare(response.streamId)
       }
   );
}

//Function passed to the menu button
_screenShareControl() {
  if (!this.state.isSharingScreen) {
    this._shareScreen()
  } else {
    this.endScreenshare()
    console.log("Implement end of screen share logic!!")
  }
  this.setState({
    isSharingScreen: !this.state.isSharingScreen,
  });
}

  render() {

    return (
      <div onMouseMove={this._onMouseMove.bind(this)}>
      {this.props.localVideos.length > 0 ?
        <MeetToolbar
          screenShareControl={this._screenShareControl.bind(this)}
          isHidden={this.state.isToolbarHidden}
          onMicrophoneMute={this._onLocalAudioMute.bind(this)}
          onCameraMute={this._onLocalVideoMute.bind(this)}
          onExpandHide={this._onExpandHide.bind(this)}
          onHangup={this._onHangup.bind(this)}
        /> : null}

      <MainVideo>
        {this.props.videoType === 'remote' ?
          <RemoteVideo
            video={this.props.connection}
          /> : null
        }
        {this.props.videoType === 'local' ?
          <LocalVideo
            video={this.props.localVideos[0]}
          /> : null
        }
      </MainVideo>

      <HorizontalWrapper isHidden={this.state.isVideoBarHidden}>
          {this.props.localVideos.map((connection) => {
            return (this.props.remoteVideos.length > 0 ) ? (
              <HorizontalBox
                key={connection.id}
                type='local'
                id={connection.id}
                localVideos={this.props.localVideos}
                remoteVideos={this.props.remoteVideos}
              >
                <LocalVideo key={connection.id} video={connection} />
              </HorizontalBox>
            )
            : ( <BlackBox
              key={connection.id}
              userName={this.props.userName}
              type='local'
              id={connection.id}
              localVideos={this.props.localVideos}
              remoteVideos={this.props.remoteVideos}
              />  ) ;
          })}
          {this.props.remoteVideos.map((connection) => {
            if (connection) {
              const displayHorizontalBox = !this._isDominant(connection.id) && this.props.remoteVideos.length > 1 ;
              console.log("Display HB for ", connection.id, "? -- ", displayHorizontalBox)
              return displayHorizontalBox ? (
                <HorizontalBox
                  key={connection.id}
                  type='remote'
                  id={connection.id}
                  localVideos={this.props.localVideos}
                  remoteVideos={this.props.remoteVideos}
                >
                  <RemoteVideo key={connection.id} video={connection} />
                </HorizontalBox>
              )
              : ( <BlackBox
                key={connection.id}
                userName={this.props.userName}
                type='remote'
                id={connection.id}
                localVideos={this.props.localVideos}
                remoteVideos={this.props.remoteVideos}
                /> ) ;
            }

            return null;
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
  })));
