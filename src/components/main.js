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
import { changeMainView, changeDominantSpeaker, changeExtInstalledState } from '../actions/video-control-actions';
import { connect } from 'react-redux';
import { loginUserAsync, leaveRoom, isCreatingRoom } from '../actions/user-actions';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import Avatar from '../containers/avatar';
import IconButton from 'material-ui/IconButton';
import sss from 'material-ui/svg-icons/toggle/star-border';
import StarBorder from 'material-ui/svg-icons/hardware/headset-mic';
import Snackbar from 'material-ui/Snackbar';
import { NameServer } from '../api/nameserver';

const authUrl = Config.authUrl;
const appKey = Config.appKey;
const nameServerUrl = 'http://localhost:8080'; //replace with Config.nameServerUrl eventually

const styles = {
  root: {
    display: 'flex',
    flexShrink: 0,
    // height: '130px',
    // flexWrap: 'wrap',
    //djustifyContent: 'space-around',

  },
  root2: {
    display: 'flex',
    flex: 1
  },
  gridList: {
    // paddingLeft: '1px',
    // display: 'flex',
    minWidth: '162px',
    flexWrap: 'nowrap',
    overflowX: 'auto', //good
    overflowY: 'hidden',
    height: '137px',
    marginBottom: '10px',
    // minWidth: '360px',
    justifyContent: 'flex-start',
    flexShrink: 0,
    // height: '100%'
  },
  localTile: {
    border: '2px solid white',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
    fontSize: '12px',
    marginBottom: '-3px',
    minWidth: '160px'
  },
  gridTile: {
    width: '160px',
    minWidth: '160px',
    marginLeft: '0px',
    marginRight: '2px',
    height: '120px',
    marginBottom: '3px',
    border: '2px solid white',
    flexShrink: 0,
    // flexShrink: 0,
  },

  remoteVideo: {
    display: 'flex',
    width: 'auto',
  }
};

const styleTest = {
  height: '120px',
  width: '140px',
  position: 'relative'
}


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
    showSpinner: state.userReducer.showSpinner,
    dominantSpeakerIndex: state.videoReducer.dominantSpeakerIndex,
    screenShareExtInstalled: state.videoReducer.screenShareExtInstalled,
    enableDomSwitch: state.videoReducer.enableDomSwitch,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    VideoControl: (videoType, videoIndex, domId, triggeredOnClick, localVideos, remoteVideos, switchingEnabled) => {
      dispatch(changeMainView(videoType, videoIndex, domId, triggeredOnClick,
                                        localVideos, remoteVideos, switchingEnabled ))
    },
    loginUserAsync: (userName, routingId, roomName, authUrl, appKey) => {
      dispatch(loginUserAsync(userName, routingId, roomName, authUrl, appKey))
    },
    leaveRoom: () => {
      dispatch(leaveRoom())
    },
    changeDominantSpeaker: (dominantSpeakerIndex) => {
      dispatch(changeDominantSpeaker(dominantSpeakerIndex))
    },
    changeExtensionStatus: (isExtInstalled) => {
      dispatch(changeExtInstalledState(isExtInstalled))
    },
    isCreatingRoom: (displayLoadingSpinner) => {
      dispatch(isCreatingRoom(displayLoadingSpinner))
    },
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
      isSharingScreen: false,
      showFeatureInDev: false,
      showDomSpeakerSnackbar: false,
      myName: "",
      remoteNames: [],
    }

    this.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
    this.onLocalVideo = this._onLocalVideo.bind(this);
    this.onRemoteVideo = this._onRemoteVideo.bind(this);
    this.onParticipantLeft = this._onParticipantLeft.bind(this);
    this.startScreenShare = this.props.startScreenshare.bind(this);
    this.endScreenshare = this.props.endScreenshare.bind(this);
    this.onReceivedNewId = this._onReceivedNewId.bind(this);
    this.extInstalled = this._isExtInstalled.bind(this);
    this.unimplementedButtonToggle = this.unimplementedButtonToggle.bind(this);
    this.enableDomSwitching = this._enableDominantSwitching.bind(this);
    this.onParticipantVideoMuted = this._onParticipantVideoMuted.bind(this);
    this.onParticipantAudioMuted = this._onParticipantAudioMuted.bind(this);
    this.onUserProfileChange = this._onUserProfileChange.bind(this);

    this.timer = setTimeout(() => {
      console.log('inside setTimeOut(), constructor')
      this.setState({
        isToolbarHidden: true,
      });
    }, 10000);

    const this_constructor = this;
    this._isExtInstalled().then(function(response) {
      console.log("Found desktop share extension. Version ", response);
      this_constructor.props.changeExtensionStatus(true)
    }).catch(function(error) {
      console.log("Could not identify desktop share extension with provided ID: ", error)
      this_constructor.props.changeExtensionStatus(false)
      })
  }

  componentWillMount() {
    //initialize spinner enabler to false
    console.log("Initializing spinner enabler to false")
    this.props.isCreatingRoom(false);
    this._updateRemoteNames(this.props.params.roomname)
  }


  componentDidMount() {
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_SWITCH_STREAM, this.onReceivedNewId);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_PARTICIPANT_VIDEO_MUTED, this.onParticipantVideoMuted);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_PARTICIPANT_AUDIO_MUTED, this.onParticipantAudioMuted);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_USER_PROFILE_CHANGE, this.onUserProfileChange);

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
    console.log("this.props: ", this.props)
    console.log("this.props.params: ", this.props.params)
    // this._setUserName("marksId", this.props.params.roomname, userName)
    this.setState({
      myName: userName ? userName : "Me",
    })
  }

componentWillReceiveProps = (nextProps) => {
  //Initially, the accessToken is undefined.
  //It receives a value when the user is logged in
  console.log("Will receive props! Current props: ")
  console.log(this.props)
  console.log("Next props: ")
  console.log(nextProps)

  if (this.props.localVideos.length === 0 && nextProps.localVideos.length > 0) {
    console.log("Local video loaded. Stop displaying the spinner")
    this.props.isCreatingRoom(false);
  }

  if (this.props.enableDomSwitch === true && nextProps.enableDomSwitch === false) {
    this.setState({
      showDomSpeakerSnackbar: true
    })
  }

  //Golang name server:
  // if (this.props.myJid !== nextProps.myJid) {
  //   console.log("Observed change in my jid: Updating user name")
  //   if (nextProps.myJid) {
  //     this._setUserName(nextProps.myJid, this.props.params.roomname, localStorage.getItem('irisMeet.userName'));
  //   }
  // }

  //Golang name server:
  // if(this.props.remoteVideos.length < nextProps.remoteVideos.length) {
  //   //only update remote names if more videos came in
  //   this._updateRemoteNames(this.props.params.roomname)
  // }

  // if (this.props.connection && nextProps.connection && (this.props.connection.id !== nextProps.connection.id)) {
  //   console.log("current ID: ", this.props.connection.id)
  //   console.log("new ID: ", nextProps.connection.id)
  //   if (nextProps.connection.id !== this.props.dominantSpeakerIndex) {
  //     console.log("Disable switching")
  //     this.setState({
  //       enableDomSwitch: false,
  //     });
  //   }
  //   else { //if switching to dom speaker's video
  //     console.log("Enable switching")
  //     this.setState({
  //       enableDomSwitch: true,
  //     }) ;
  //   }
  // }

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
    this._deleteRoomData(this.props.params.roomname)
  }

  _onLocalVideo(videoInfo) {
    console.log('NUMBER OF LOCAL VIDEOS: ' + this.props.localVideos.length);
    if (this.props.localVideos.length > 0) {
      this.props.VideoControl('local', this.props.localVideos[0].id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)
    }
  }

  _onRemoteVideo(videoInfo) {
    let numRemoteVideos = this.props.remoteVideos.length;
    console.log('NUMBER OF REMOTE VIDEOS: ' + numRemoteVideos);
    if (numRemoteVideos === 1) {
      this.props.VideoControl('remote', this.props.remoteVideos[0].id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)
    }
    //a new participant entered the room. Update my local array of users with their name and jid
    //prepare the jid string by removing the roomId part
    //??
    // let jid = this.props.remoteVideos[numRemoteVideos-1].participantJid
    // jid = this._truncateJid(jid)
    // this._getUserName(jid, this.props.params.roomname )
  }

_onReceivedNewId(data) {
  console.log("RECEIVED NEW ID")
  console.log("Old id: ", data.oldID)
  console.log("New id: ", data.newID)

  this.props.VideoControl('remote', data.newID, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)

}

  _onParticipantLeft(participantInfo) {
    console.log('Remote participant left: ', participantInfo);
    console.log(this.props.remoteVideos.length);
    if (this.props.remoteVideos.length === 0) {
      if (this.props.localVideos.length > 0) {
        // no participants so go back to local video
        console.log('Remote participant back to local');
        this.props.VideoControl('local', this.props.localVideos[0].id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)
      }
    }

    if (this.state.mainVideoConnection.connection &&
        this.state.mainVideoConnection.connection.participantJid === participantInfo.participantJid) {
      if (this.props.localVideos.length > 0) {
        // if the participant who left was on main screen replace it with local
        // video
        this.props.VideoControl('local', this.props.localVideos[0].id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)
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
      //first index in the next line may need to be 0 after the SDK update 6/15/2017
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
      this.props.VideoControl('remote', matchedConnection.id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)

    } else if (this.props.localVideos.length > 0) {
      console.log("Local speaker is dominant: ", this.props.localVideos[0])
      //no remote participants found so assume it is local speaker
      //change dominant speaker but don't change main view, keep displaying
      //the most recent remote dominant speaker
      this.props.changeDominantSpeaker(this.props.localVideos[0].id)
    }
  }

  _onParticipantVideoMuted(jid, muted){
    console.log("_onParticipantVideoMuted jid " + jid + " muted "+muted);
  }

  _onParticipantAudioMuted(jid, muted){
    console.log("_onParticipantAudioMuted jid " + jid + " muted "+muted);
  }

  _onUserProfileChange(jid, profileJson){
    console.log('_onUserProfileChange ' + jid + ' profileJson ' + JSON.stringify(profileJson));
    // this function is called when:
    //   1) remote participant is first detected upon joining the room
    //   2) remote participant changes name
    // when either of these events occurs, update the remoteNames state
    // Lookup of names by jid in the horizontal box part can remain the same
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
        //
        //
        // this.props.initializeWebRTC(this.props.userName, this.props.routingId,
        //   this.props.roomName,
        //   roomId,
        //   this.props.decodedToken.payload['domain'].toLowerCase(),
        //   {
        //     eventManagerUrl: Config.eventManagerUrl,
        //     notificationServer: Config.notificationServer },
        //     this.props.accessToken,
        //     '640',
        //     true,
        //     true
        //   );

          let config = {
            userName: this.props.userName,
            roomId: roomId,
            roomName: this.props.roomName,
            domain: this.props.decodedToken.payload['domain'].toLowerCase(),
            token: this.props.accessToken,
            routingId: this.props.routingId,
            resolution: 'hd',
            hosts: {
              eventManagerUrl: Config.eventManagerUrl,
              notificationServer: Config.notificationServer
            },
            videoCodec: 'h264'
          }
          this.props.initializeWebRTC(config)


      })
    });
  }


//This is currently done in loginUserAsync()
  _userFailedLogin(error) {
    // TODO: login error handler
    console.log('Login failure: ');
    console.log(error);
  }

_displayDialer() {
  //redirect to the dialer page
  const hostname = window.location.origin;
  window.location.assign(hostname + '/dialerapp/dialer');
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

    //now that we have both username and roomname, update entry in the IDS

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

  unimplementedButtonToggle() {
    this.setState({
      showFeatureInDev: !this.state.showFeatureInDev,
    });
  }

  _onExpandHide() {
    console.log("onexpandhide")
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

  _enableDominantSwitching() {
    console.log("Enabling dom switching, hiding last button from toolbar")
    //switch to dominant speaker's video
    //if dominant is local, switch to local. Else, switch to remote
    if (this.props.localVideos[0].id === this.props.dominantSpeakerIndex) {
      this.props.VideoControl('local', this.props.localVideos[0].id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, true)
    } else {
      this.props.VideoControl('remote', this.props.dominantSpeakerIndex, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, true)
    }
  }


_isExtInstalled() {
  //const extId = 'ninfhlnofdcigedlpjkgkfchccfikdnf'; //experimental
  const extId = 'ofekpehdpllklhgnipjhnoagibfdicjb'; //from web store

  return new Promise(function(resolve, reject) {
    window.chrome.runtime.sendMessage(
      extId, {
        getVersion: true,
        getStream: false,
        sources: null
      },
      response => {
        if (response && response.version) {
          resolve(response.version)
        }
        else {
          reject(extId)
        }
    })
  })
}

_shareScreen() {
  const this_main = this;
  let screenShareStarted = false //updated to true/false depending on extension response

  const extId = 'ofekpehdpllklhgnipjhnoagibfdicjb'; //from web store
  //const extId = 'ninfhlnofdcigedlpjkgkfchccfikdnf'; //experimental

  //There is no need to verify in this function if the extension is installed
  //This check was already performed before calling _shareScreen
  window.chrome.runtime.sendMessage(
       extId, {
           // getVersion: true,
           getStream: true,
           sources: ['screen', 'window']
       },
       response => {
           if (!response) {
               console.log("Error contacting the screen share extension: ")
               const lastError = window.chrome.runtime.lastError;
               console.log(lastError);
               screenShareStarted = false
           }
           else {
           console.log('Response from extension: ', response);


           if (response && response.streamId !== "") {
             console.log("Extension responded with ID: ", response.streamId)
             screenShareStarted = true
             this_main.startScreenShare(response.streamId)
             this_main.setState({
               isSharingScreen: screenShareStarted
             });
             screenShareStarted = true
           }
           else {
             console.log("Invalid streamId --> not starting screen share")
             console.log("User canceled screen sharing prompt")
             screenShareStarted = false
           }
       }
     }
   );
   return screenShareStarted
}


//Function passed to the menu button
_screenShareControl(changeExtensionStatus) {
  console.log("Launching screenShareControl")
  //changeExtensionStatus is a boolean parameter.
  //When the extension was just installed, _screenShareControl(true) is
  //called. In other cases, _screenShareControl(false)
  if (changeExtensionStatus) {
    //If extension was just installed, notify Redux store that
    //the extension now exists
    this.props.changeExtensionStatus(true)
  }
  console.log("Screen Share control. Extension installed? -- ", this.props.screenShareExtInstalled)
  let screenShareStarted = false
  if (!this.state.isSharingScreen) {
    screenShareStarted = this._shareScreen()
    //??
    this.props.VideoControl('remote', this.props.dominantSpeakerIndex, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, true)
    console.log("ShareScreen returned: ", screenShareStarted)
    // if (screenShareStarted !== this.state.isSharingScreen) {
    //   console.log("Setting this.state.isSharingScreen to ", screenShareStarted)
    //   this.setState({
    //       isSharingScreen: screenShareStarted,
    //   });
    // }
  } else {
    //already sharing screen, so end screen share
    this.endScreenshare()
    this.setState({
      isSharingScreen: false,
    });
  }
}

_dontDisplaySnackbar() {
  this.setState({
    showDomSpeakerSnackbar: false
  });
}

_getUserName(userJid, roomname) {
  console.log("Calling getUserName with arguments: ")
  console.log(userJid, roomname)
  let ns = new NameServer({'nameServerUrl' : nameServerUrl, 'classname' : roomname});
  return ns.getUserByJid(userJid, roomname).then(
    data => {
      if (data[0] && data[0].username && data[0].userJid && data[0].roomname) {
        console.log("Successfully got the user name from IDS: ", data)
        console.log("Remote names before push: ", this.state.remoteNames)
        let names = this.state.remoteNames;
        let newNameObject = {userName: data[0].username,
                             userJid: data[0].userJid,
                             roomName: data[0].roomname};
        names.push(newNameObject);
        this.setState({
          remoteNames: names
        })
      }
      else {
        throw ("Empty or invalid data received from name server. Room: " + roomname + ", userJid: ", + userJid)
      }
    })
    .catch(
      error => {console.log("ERROR GETTING USERNAME:  " + error); }
    );
}

_findUserName(namesArray, jid) {
  jid = jid.replace(/\//g, '_')
  console.log("Looking for jid : ", jid)
  console.log("in array: ")
  console.log(namesArray)
  let userObject = namesArray.filter(function(obj) {
    return obj.userJid === jid
  })
  //it is possible that more than one object with a given jid are found.
  //Ignore all results past the first one, this won't be an issue with actual
  //calls (unless the user opens the same room several times in different browsers/incognito
  //with different user names, which is unlikely)
  if (userObject.length !== 0) {
    console.log("Object valid. Name is : ", userObject[0].userName)
  }
  return userObject[0] ? userObject[0].userName : null
}

_truncateJid(jid) {
  //remote the roomID part of the jid, and return just the user part
  return jid.substring(jid.indexOf("/") + 1, jid.length)
}

_setUserName(userJid, roomname, username) {
  let ns = new NameServer({'nameServerUrl' : nameServerUrl, 'classname' : roomname});
  return ns.addOrUpdateUser(userJid, roomname, username).then(
    data => {
      console.log("Successfully added a new user to IDS: ", data)
      this._updateRemoteNames(this.props.params.roomname) }
    )
    .catch(
      error => {console.log("Error sending my user name to IDS: " + error); }
    );
}

_updateRemoteNames(roomname) {
  let ns = new NameServer({'nameServerUrl' : nameServerUrl, 'classname' : roomname})
  return ns.getAllUsers(roomname).then(
    data => {
      console.log("All users data: ", data)
      this.setState({
        remoteNames: data.map(function(a) {return {userName: a.username,
                                                   userJid: a.userJid,
                                                   roomName: a.roomname}
                                          }),
      })
    }
  ).catch(
    error => {console.log("Error getting all the names in the room: ", error); }
  );
}

_deleteRoomData(roomname) {
  console.log("Implement this function after making modifications to the IDS")
  console.log("Clear all user data from a given room when everyone leaves")
}

  render() {
    console.log("print window: ", window)
    const this_main = this;
    console.log("Enabledomswitch: ", this.props.enableDomSwitch)
    console.log("Remote names main: ", this.state.remoteNames)
    console.log("Remote videos main: ", this.props.remoteVideos)
    return (
      <div onMouseMove={this._onMouseMove.bind(this)}>
        <Snackbar
          open={this.state.showFeatureInDev}
          message="This feature is currently in development"
          autoHideDuration={4000}
          onRequestClose={this.unimplementedButtonToggle}
          style={{textAlign: "center", color: 'rgb(0, 188, 212)', opacity: 0.85,}}
        />
        <Snackbar
          open={this.props.enableDomSwitch === false && this.state.showDomSpeakerSnackbar}
          message="Dominant speaker switching disabled. Click on the rightmost toolbar icon to enable."
          autoHideDuration={6000}
          onRequestClose={this._dontDisplaySnackbar.bind(this)}
          style={{textAlign: "center", color: 'rgb(0, 188, 212)', opacity: 0.85,}}
        />

        {this.props.showSpinner !== undefined ?
        <Dialog
          title="Loading..."
          titleStyle={{textAlign: "center"}}
          modal={false}
          open={this.props.showSpinner}
          style={{textAlign: "center"}}
          >
          <CircularProgress
            size={80}
            thickness={7}
          />
        </Dialog>
        : null }

        {this.props.localVideos.length > 0 ?
          <MeetToolbar
            screenShareControl={this._screenShareControl.bind(this)}
            isHidden={this.state.isToolbarHidden}
            onMicrophoneMute={this._onLocalAudioMute.bind(this)}
            onCameraMute={this._onLocalVideoMute.bind(this)}
            onExpandHide={this._onExpandHide.bind(this)}
            onHangup={this._onHangup.bind(this)}
            isExtInstalled={this._isExtInstalled.bind(this)}
            extInstalled={this.props.screenShareExtInstalled}
            showInDev={this.unimplementedButtonToggle.bind(this)}
            domSpeakerSwitchEnabled={this.props.enableDomSwitch !== undefined ? this.props.enableDomSwitch : true}
            enableDomSwitchFunc={this.enableDomSwitching.bind(this)}
          /> : null}

            <MainVideo className={"main_video"}>
              {
                this.props.videoType === 'remote' && true ?
                <RemoteVideo
                  video={this.props.connection}
                /> : null
              }
              {this.props.videoType === 'local' && true ?
                <LocalVideo
                  video={this.props.localVideos[0]}
                /> : null
              }
            </MainVideo>

          <section className={this.state.isVideoBarHidden ? "footer hideFooter" : "footer showFooter"} >
            <div className={"localVideo footer-item"}>
              <div style={styles.root2}>
                <GridTile
                  style={this.props.localVideos.length > 0 ? styles.localTile : null}
                  key={'localVideo'}
                  className={'gridTileClass'}
                  title={this.state.myName}
                  containerElement={'HorizontalBox'}
                  actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
                  titleStyle={styles.titleStyle}
                  titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                >
                {this.props.localVideos.map((connection) => {
                  return (this.props.remoteVideos.length > 0 ) ? (
                    <HorizontalBox
                      key={connection.id}
                      type='remote'
                      id={connection.id}
                      domId={this.props.dominantSpeakerIndex}
                      localVideos={this.props.localVideos}
                      remoteVideos={this.props.remoteVideos}
                      switchingEnabled={this.props.enableDomSwitch}
                    >
                      <LocalVideo key={connection.id} video={connection} />
                    </HorizontalBox>

                  )
                  : ( <Avatar
                    key={connection.id}
                    userName={this.props.userName}
                    type='local'
                    id={connection.id}
                    hash={connection.id}
                    localVideos={this.props.localVideos}
                    remoteVideos={this.props.remoteVideos}
                    switchingEnabled={this.props.enableDomSwitch}
                    />  ) ;
                })}
                </GridTile>
            </div>
          </div>

          <div className={"remoteVideos footer-item"}>
            <GridList className={"remoteGrid"} style={styles.gridList} cols={2.2}>
              {this.props.remoteVideos.map((connection) => {
                if (connection) {
                  let name = this._findUserName(this.state.remoteNames, this._truncateJid(connection.participantJid))
                  let counter = 0
                  while (!name && counter < 3) {
                    console.log("Couldn't get the name. Trying again. Tries left: ", 3-counter)
                    name = this._findUserName(this.state.remoteNames, this._truncateJid(connection.participantJid))
                    counter++;
                  }
                  let displayHorizontalBox = (!this._isDominant(connection.id) && this.props.remoteVideos.length > 1) || !this.props.enableDomSwitch;
                  console.log("Display HB for ", connection.id, "? -- ", displayHorizontalBox)
                  return displayHorizontalBox ? (
                    <GridTile
                      cols={1.15}
                      rows={0.5}
                      key={connection.id}
                      style={styles.gridTile}
                      title={name ? name : "Unknown User"}
                      actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
                      titleStyle={styles.titleStyle}
                      titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                    >
                    <HorizontalBox
                      key={connection.id}
                      type='remote'
                      id={connection.id}
                      domId={this.props.dominantSpeakerIndex}
                      localVideos={this.props.localVideos}
                      remoteVideos={this.props.remoteVideos}
                      switchingEnabled={this.props.enableDomSwitch}
                    >
                      <RemoteVideo key={connection.id} video={connection} />
                    </HorizontalBox>
                    </GridTile>
                  )

                : (
                  <GridTile
                    cols={1.15}
                    rows={0.5}
                    style={styles.gridTile}
                    key={connection.id}
                    title={name ? name : "Unknown User"}
                    actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
                    titleStyle={styles.titleStyle}
                    titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  > <Avatar
                    key={connection.id}
                    userName={this.props.userName}
                    type='local'
                    id={connection.id}
                    hash={connection.id}
                    localVideos={this.props.localVideos}
                    remoteVideos={this.props.remoteVideos}
                    switchingEnabled={this.props.enableDomSwitch}
                    />
                </GridTile>
                )
                }

                return null;
              })}
            </GridList>
          </div>
        </section>

      {this.state.showUser || this.state.showRoom ?
        <LoginPanel
          ref='loginpanel'
          showSpinner={this.props.showSpinner}
          showRoom={this.state.showRoom}
          showUser={this.state.showUser}
          onAction={this._onLoginPanelComplete.bind(this)}
          displayDialer={this._displayDialer.bind(this)}
        /> : null}
      </div>
    );
  }
  })));
