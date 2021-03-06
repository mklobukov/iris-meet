import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from '../containers/meet-toolbar';
import HorizontalBox from '../containers/horizontal-box';
import LoginPanel from '../containers/login-panel';
import { withRouter } from 'react-router';
import withWebRTC, { LocalVideo, RemoteVideo, WebRTCConstants } from 'iris-react-webrtc';
import Config from '../../config.json';
import getQueryParameter from '../utils/query-params';
import validResolution from '../utils/verify-resolution';
import { getRoomId } from '../api/RoomId';
import { getChatMessages } from '../api/get-chat-messages';
import './style.css';
import { changeMainView, changeDominantSpeaker, changeExtInstalledState } from '../actions/video-control-actions';
import { connect } from 'react-redux';
import { loginUserAsync, leaveRoom, isCreatingRoom } from '../actions/user-actions';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import Avatar from '../containers/avatar';
import AvatarImage from '../components/avatar-image';
import Snackbar from 'material-ui/Snackbar';
import { NameServer } from '../api/nameserver';
import UserNameBox from '../containers/username-box';
import VideoActionIcons from '../containers/video-action-icons';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ChatBox from './chat/chat-box';
import ExitButton from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';

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
    minWidth: '300px',
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
    marginBottom: '0px',
    minWidth: '160px',
    //test!!!!
    display: 'flex'
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
    dominantSpeakerJid: state.videoReducer.dominantSpeakerJid,
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
    changeDominantSpeaker: (dominantSpeakerIndex, dominantSpeakerJid) => {
      dispatch(changeDominantSpeaker(dominantSpeakerIndex, dominantSpeakerJid))
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
      userData: {},
      resolution: "hd",
      mutedVideos: [],
      drawerOpen: false,
      chatMessages: [],
      hasUnreadMessages: false,
    }

    this.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
    this.onLocalVideo = this._onLocalVideo.bind(this);
    this.onRemoteVideo = this._onRemoteVideo.bind(this);
    this.onParticipantLeft = this._onParticipantLeft.bind(this);
    this.startScreenShare = this.props.startScreenshare.bind(this);
    this.endScreenshare = this.props.endScreenshare.bind(this);
    this.muteRemoteAudio = this.props.muteParticipantAudio.bind(this);
    this.muteRemoteVideo = this.props.muteParticipantVideo.bind(this);
    this.onReceivedNewId = this._onReceivedNewId.bind(this);
    this.extInstalled = this._isExtInstalled.bind(this);
    this.unimplementedButtonToggle = this.unimplementedButtonToggle.bind(this);
    this.enableDomSwitching = this._enableDominantSwitching.bind(this);
    this.onParticipantVideoMuted = this._onParticipantVideoMuted.bind(this);
    this.onParticipantAudioMuted = this._onParticipantAudioMuted.bind(this);
    this.onUserProfileChange = this._onUserProfileChange.bind(this);
    this.changeMyName = this.props.setDisplayName.bind(this);
    this.sendChatMessage = this.props.sendChatMessage.bind(this);
    this.onChatMessage = this.onChatMessage.bind(this);
    this.handleDrawerToggle = this._handleDrawerToggle.bind(this);

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
  }


  componentDidMount() {
    //this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_SESSION_CREATED)
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, this.onDominantSpeakerChanged);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, this.onLocalVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteVideo);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onParticipantLeft);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_SWITCH_STREAM, this.onReceivedNewId);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_PARTICIPANT_VIDEO_MUTED, this.onParticipantVideoMuted);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_PARTICIPANT_AUDIO_MUTED, this.onParticipantAudioMuted);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_USER_PROFILE_CHANGE, this.onUserProfileChange);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_CHAT_MESSAGE_RECEIVED, this.onChatMessage);

    const requestedResolution = getQueryParameter('resolution');
    console.log("Resolution: ", requestedResolution);
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
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_CHAT_MESSAGE_RECEIVED, this._onChatMessageReceived);
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
  }

_onReceivedNewId(data) {
  console.log("RECEIVED NEW ID")
  console.log("Old id: ", data.oldID)
  console.log("New id: ", data.newID)

  this.props.VideoControl('remote', data.newID, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)

}

  _onParticipantLeft(participantInfo) {
    console.log('Remote participant left: ', participantInfo);

    if (this.props.remoteVideos.length === 0 && this.props.localVideos.length > 0) {
        // no participants so go back to local video
        console.log('No remote videos left. Switch main screen to local video');
        this.props.VideoControl('local', this.props.localVideos[0].id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)
        return
    }

    //if there are remote videos, check if it was the dominant speaker that left
    //if so, switch to my own local video. Otherwise, do nothing

    //const matchedConnection = this._findDominantSpeaker(participantInfo.participantJid);
    if (participantInfo.participantJid === this.props.dominantSpeakerJid) {
      //if #remote videos is 1, switch to the other participant. Otherwise, switch to local
      const type = this.props.remoteVideos.length === 1 ? 'remote' : 'local';
      const id = type === 'remote' ? this.props.remoteVideos[0].id : this.props.localVideos[0].id;
      console.log("Dominant speaker left. Switching to " + type + " video");
      this.props.VideoControl(type, id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch);
    } else {
      console.log("Non-dominant speaker left.")
    }
  }

  _findDominantSpeaker(jid) {
    const dom = jid.substring(0, jid.lastIndexOf("@"));
    const matchedConnection = this.props.remoteVideos.find((connection) => {
      let participantId = connection.participantJid;
      //first index in the next line may need to be 0 after the SDK update 6/15/2017
      console.log("Checking this participantId: ", participantId)
      const endPoint = participantId.substring(0, participantId.indexOf("@iris-meet.comcast.com"))
      console.log("after truncation: ", endPoint)
      console.log("endpoint and dom: " + endPoint + ", " + dom)
      return endPoint === dom;
      });

    return matchedConnection ? matchedConnection : null
  }


  _onDominantSpeakerChanged(dominantSpeakerEndpoint) {
    //let participant = track.getParticipantId();
    //let baseId = participant.replace(/(-.*$)|(@.*$)/,'');
    console.log("Got a new dominant speaker notification\nLooking through remotes for: ", dominantSpeakerEndpoint)
    const matchedConnection = this._findDominantSpeaker(dominantSpeakerEndpoint);
    // //extract the part of dominantSpeakerEndpoint to use for comparison with connection id
    // const dom = dominantSpeakerEndpoint.substring(0, dominantSpeakerEndpoint.lastIndexOf("@"));
    // const matchedConnection = this.props.remoteVideos.find((connection) => {
    //   let participantId = connection.participantJid;
    //   //first index in the next line may need to be 0 after the SDK update 6/15/2017
    //   console.log("Checking this participantId: ", participantId)
    //   const endPoint = participantId.substring(0, participantId.indexOf("@iris-meet.comcast.com"))
    //   console.log("after truncation: ", endPoint)
    //   console.log("endpoint and dom: " + endPoint + ", " + dom)
    //   return endPoint === dom;
    //   });
    if (matchedConnection) {
      console.log("New dominant speaker among remotes: ", matchedConnection.participantJid)
      //entering this if statement implies that the dominant speaker is remote
      //no further checks are necessary
      this.props.changeDominantSpeaker(matchedConnection.id, matchedConnection.participantJid)
      this.props.VideoControl('remote', matchedConnection.id, this.props.dominantSpeakerIndex, false, this.props.localVideos, this.props.remoteVideos, this.props.enableDomSwitch)

    } else if (this.props.localVideos.length > 0) {
      console.log("Local speaker is dominant: ", this.props.localVideos[0])
      //no remote participants found so assume it is local speaker
      //change dominant speaker but don't change main view, keep displaying
      //the most recent remote dominant speaker
      this.props.changeDominantSpeaker(this.props.localVideos[0].id, 'local')
    }
  }

  _isRemoteVideoMuted(connection) {
    let muted = false;
    console.log("Remote video muted: ", connection);
    if (connection && connection.participantJid && this.state.userData[this._truncateJid(connection.participantJid)]) {
      console.log("Muted? --> ", this.state.userData[this._truncateJid(connection.participantJid)].videoMuted )
      muted = this.state.userData[this._truncateJid(connection.participantJid)].videoMuted;
    }
    return muted
  }

  _onParticipantVideoMuted(videoInfo){
    console.log("_onParticipantVideoMuted client. \nJid: ", videoInfo.jid, "\nMuted: ", videoInfo.muted);

    let profiles = this.state.userData;
    profiles[this._truncateJid(videoInfo.jid)] ? profiles[this._truncateJid(videoInfo.jid)].videoMuted = videoInfo.muted : console.log("no such profile: ", videoInfo.jid);
    this.setState({
      userData: profiles
    }, () => {console.log("Updated profiles videomute: ", this.state.userData)})
  }

  _onParticipantAudioMuted(audioInfo){
    console.log("_onParticipantAudioMuted: ", audioInfo)
  }

  _onUserProfileChange(profile) {
    console.log('_onUserProfileChange in the client\nFull Jid before truncation: ', profile.jid)
    console.log("Name: ", profile.name);
    console.log("Profile: ", profile)
    // this function currently only takes care of the names. It's is called when:
    //   1) remote participant is first detected upon joining the room
    //   2) remote participant changes name
    // when either of these events occurs, update the remoteNames state
    // Lookup of names by jid in the horizontal box part can remain the same

    let profiles = this.state.userData;
    const userFound = profiles[this._truncateJid(profile.jid)] ? true : false;

    if (!userFound) {
      //put user's name into the object
      profiles[this._truncateJid(profile.jid)] = {"userName": profile.name, "videoMuted": false}
    } else {
      //update user's name
      profiles[this._truncateJid(profile.jid)].userName = profile.name
    }

    // update state with the new profile
    this.setState({
      userData: profiles
    }, console.log("Updated names/profiles: ", this.state.userData))

    //now also change names in the chat
    const messages = this.state.chatMessages.slice();
    let modified = false;
    const this_main = this;
    messages.forEach(function(message) {
      if(message.senderJid === this_main._truncateJid(profile.jid)) {
        message.sender = profile.name;
        modified = true;
      }
    })
    modified ? this.setState({chatMessages: messages}, console.log("Updated name: updated names in the chat")) : console.log("Updated name: no sender names changed")

  }

  onChatMessage(messageJson) {
    if (!this.state.drawerOpen) {
      this.setState({
        hasUnreadMessages: true
      })
    }

    //identify sender
    const jid = this._truncateJid(messageJson.from);
    const sender = this.state.userData[jid].userName;
    //get timestamp
    const clientDate = new Date();

    let newMessage = {
      id: this.state.chatMessages.length + 1,
      timestamp: clientDate,
      senderJid: jid,
      sender: sender,
      text: messageJson.message
    }
    this.setState({ chatMessages: [ ...this.state.chatMessages, newMessage ] });

  }

  _userLoggedIn() {
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      const domain = this.props.decodedToken.payload['domain'].toLowerCase();
      let roomIdResponse = null;
      //let requestedResolution = getQueryParameter('resolution');
      let requestedResolution = localStorage.getItem('irisMeet.resolution')
      console.log("requested resolution: ", requestedResolution);
      if (!validResolution(requestedResolution)) {
        console.log('Requested resolution is not valid.  Switching to default hd.');
        requestedResolution = 'hd';
      }
      const this_main = this;
      getRoomId(this.props.roomName, this.props.accessToken)
      .then((response) => {
        console.log("Response with roomid: ", response);
        const roomId = response.room_id;
        roomIdResponse = roomId;
        this.setState({roomId: roomId })

          let config = {
            userName: this.props.userName,
            roomId: roomId,
            roomName: this.props.roomName,
            domain: this.props.decodedToken.payload['domain'].toLowerCase(),
            token: this.props.accessToken,
            routingId: this.props.routingId,
            resolution: requestedResolution,
            hosts: {
              eventManagerUrl: Config.eventManagerUrl,
              notificationServer: Config.notificationServer
            },
            videoCodec: 'h264'
          }
          this.props.initializeWebRTC(config)
          getChatMessages(config.roomName, this.props.accessToken, 100)
          .then((response) => {
            console.log("Response from chat messages storage: ", response);
            response.forEach(function(item) {
              if (item.event_type === "chat") {
                const message = JSON.parse(item.userdata).data.text;
                const senderJid = item.event_deposited_by;
                const timestamp = item.time_posted;
                this_main._addMessageToState(message, senderJid, timestamp)
                //Tell user that there are unread messages from before user joined?
                //this_main.setState({hasUnreadMessages: true})
                console.log("this message: ", message)
                console.log("from: ", senderJid)
                console.log("timestamp: ", timestamp)

              }
            })
          })
          .catch(
            error => {console.log("Something went bad...", error)}
          )
      })

    });
  }

  _addMessageToState(message, senderJid, timestamp) {
    console.log("inside add message");
    console.log("Jid before: ", senderJid);
    const jid = this._truncateJidFromEVM(senderJid);
    console.log("jid after: ", jid)
    const senderName = this.state.userData[jid] ? this.state.userData[jid].userName : "Iris user (left room)"
    let newMessage = {
      id: this.state.chatMessages.length + 1,
      timestamp: new Date(timestamp),
      senderJid: jid,
      sender: senderName,
      text: message
    }
    console.log("adding message to state: ", newMessage);
    this.setState({chatMessages: [newMessage, ...this.state.chatMessages]})
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
    this.setState({myName: userName})

    //now that we have both username and roomname, update entry in the IDS

    const hostname = window.location.origin;
    localStorage.setItem('irisMeet.resolution', this.refs.loginpanel.resolution)

    window.location.assign(hostname + '/' + roomName)
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

_truncateJid(jid) {
  //remote the roomID part of the jid, and return just the user part
  //return jid.substring(jid.indexOf("/") + 1, jid.length)
  return jid.substring(0, jid.indexOf("@"))
}

_truncateJidFromEVM(jid) {
  return jid.substring(0, jid.indexOf("@"))
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

_onResolutionChoice(res) {
  this.setState({resolution: res}, () => {
    console.log("CHOSEN RESOLUTION: ", this.state.resolution)
    localStorage.setItem('irisMeet.resolution', this.state.resolution);
   })
}

_setDisplayName(name) {
  this.changeMyName(name);
  localStorage.setItem('irisMeet.userName', name);
  this.setState({myName: name})
}

_remoteVideoAndImage() {
  return (<div>
            <RemoteVideo video={this.props.connection} />
            <img src="https://physics.tau.ac.il/sites/exactsci_en.tau.ac.il/files/styles/faculty_banner_729x359/public/astrophysics_home_page_729X359-2_0.jpg?itok=xQl7j2W9" />
          </div>)
}

_localVideoAndImage() {
  return (<div>
            <LocalVideo video={this.props.localVideos[0]} />
            <img src="https://physics.tau.ac.il/sites/exactsci_en.tau.ac.il/files/styles/faculty_banner_729x359/public/astrophysics_home_page_729X359-2_0.jpg?itok=xQl7j2W9" />
          </div>)
}

_renderMainVideo(videoType, remoteMuted) {
  const show = true;
  const showPic = false;

  if (videoType === "remote" && show) {
    console.log("Rendering the main video. videoType: ", videoType, "muted: ", remoteMuted)
    return (
      <div>
      <RemoteVideo video={this.props.connection} />
      {remoteMuted && showPic ?
        <AvatarImage hash={this.props.connection.participantJid} />
      : null }
    </div>
    )
  } else if (videoType === "local" && show) {
    console.log("Rendering the main video. videoType: ", videoType, "muted: ", this.state.isVideoMuted)
      return (
        <div>
          <LocalVideo video={this.props.localVideos[0]} />
          {this.state.isVideoMuted ?
            <AvatarImage hash={this.props.connection.id} />
          : null }
        </div>
    )
  }
}

_handleDrawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen, hasUnreadMessages: false})

_sendMessage(jid, message) {
  const clientDate = new Date();
  console.log("new date: ", clientDate)
  console.log("get time: ", clientDate.getTime())
  const exp = new Date(clientDate.getTime())
  console.log("and now: ", exp)
  let newMessage = {
    id: this.state.chatMessages.length + 1,
    timestamp: clientDate,
    sender: this.state.myName,
    text: message
  }
  this.setState({ chatMessages: [ ...this.state.chatMessages , newMessage] })
  this.sendChatMessage(jid, message)
  // let out = document.getElementById("chat-messages-id");
  // if (out) {
  //   out.scrollTop = out.scrollHeight;
  // }
}

  render() {

    console.log("Dominant speaker ID: ", this.props.dominantSpeakerIndex)
    console.log("remote videos main: ", this.props.remoteVideos)
    const this_main = this;
    const messages = this.state.chatMessages.slice()
    return (
      <div onMouseMove={this._onMouseMove.bind(this)}>
        <div>
          <Drawer open={this.state.drawerOpen}>
            <IconButton>
              <ExitButton onClick={this._handleDrawerToggle} />
            </IconButton>
            <ChatBox name={this.state.myName}
                     myId={this.props.localVideos[0] ? this.props.localVideos[0].id : null}
                     messages={messages.reverse()}
                     sendChatMessage={this._sendMessage.bind(this)}/>
          </Drawer>
        </div>
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
            handleDrawerToggle={this.handleDrawerToggle}
            hasUnreadMessages={this.state.hasUnreadMessages}
          /> : null}


          <MainVideo className={"main_video"}>
            <div>
              {this._renderMainVideo(this.props.videoType, this._isRemoteVideoMuted(this.props.connection))}
            </div>
          </MainVideo>

          <section className={this.state.isVideoBarHidden ? "footer hideFooter" : "footer showFooter"} >
            <div className={"localVideo footer-item"}>
              <div style={styles.root2}>
                <GridTile
                  style={this.props.localVideos.length > 0 ? styles.localTile : null}
                  key={'localVideo'}
                  className={'gridTileClass'}
                  title={<UserNameBox
                    setDisplayName={this._setDisplayName.bind(this)}
                    name={localStorage.getItem('irisMeet.userName')}
                    charLimit={20} />}
                  containerElement={'HorizontalBox'}
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
                  const name = this.state.userData[this._truncateJid(connection.participantJid)] ? this.state.userData[this._truncateJid(connection.participantJid)].userName : null;
                  console.log("USERNAME TO DISPLAY: ", name)
                  const jid = connection.participantJid;
                  let displayHorizontalBox = (!this._isDominant(connection.id) && this.props.remoteVideos.length > 1) || !this.props.enableDomSwitch;
                  console.log("Display HB for ", connection.id, "? -- ", displayHorizontalBox)
                  return displayHorizontalBox ? (
                    <GridTile
                      cols={1.15}
                      rows={0.5}
                      key={connection.id}
                      style={styles.gridTile}
                      title={name ? <div>{name}</div> : "Remote Video"}
                      actionIcon={<VideoActionIcons
                        muteVideo={this.muteRemoteVideo}
                        muteAudio={this.muteRemoteAudio}
                        participantJid={jid}
                        />}
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
                    title={name ? name : "Remote Video"}
                    actionIcon={<VideoActionIcons
                      muteVideo={this.muteRemoteVideo}
                      muteAudio={this.muteRemoteAudio}
                      participantJid={jid}
                      />}
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
          onResolutionChoice={this._onResolutionChoice.bind(this)}
        /> : null}
      </div>
    );
  }
  })));
