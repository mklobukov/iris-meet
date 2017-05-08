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
import './style.css'
import { changeMainView, changeDominantSpeaker } from '../actions/video-control-actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loginUserAsync, leaveRoom } from '../actions/user-actions'

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
    }

    this.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
    this.onLocalVideo = this._onLocalVideo.bind(this);
    this.onRemoteVideo = this._onRemoteVideo.bind(this);
    this.onParticipantLeft = this._onParticipantLeft.bind(this);

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
        routingId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
        localStorage.setItem('irisMeet.routingId', routingId);
      }
      console.log(this.props.params.roomname)
      this.props.loginUserAsync(userName, routingId, this.props.params.roomname, authUrl, appKey)
    }
//
// //**Listener for screen share
// window.addEventListener('message', (event) => {
//   console.log("RECEIVED EVENT: ", typeof event)
//   console.log(event)
//
//   console.log("window location origin: ")
//   console.log(window.location.origin)
//   console.log("event origin: ", event.origin)
//   console.log("event data outside: ", event)
//
//   //if (event.origin === window.location.origin) {
//     //if (event.data.video && event.origin !== "https://www.webrtc-experiment.com") {
//       console.log("Received event with data.video")
//       if (!this.props.isSharingScreen && event.dat) {
//       console.log("Launching screenshare in window listener with chrome id ", event.data)
//       this.props.startScreenshare(event.data);
//     //}
//   }
// }, false);
// //**
//
//
// //**Self-calling function defining screen-id
//
// const this_main = this;
//     (function() {
//         window.getScreenId = function(callback) {
//             // for Firefox:
//             // sourceId == 'firefox'
//             // screen_constraints = {...}
//             if (!!navigator.mozGetUserMedia) {
//                 callback(null, 'firefox', {
//                     video: {
//                         mozMediaSource: 'window',
//                         mediaSource: 'window'
//                     }
//                 });
//                 return;
//             }
//
//             window.addEventListener('message', onIFrameCallback);
//
//             function onIFrameCallback(event) {
//                 if (!event.data) return;
//
//                 if (event.data.chromeMediaSourceId) {
//                   console.log("GOT A CHROMEMEDIASOURCEID ", event.data.chromeMediaSourceId)
//                     if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
//                         callback('permission-denied');
//                     } else callback(null, event.data.chromeMediaSourceId, getScreenConstraints(null, event.data.chromeMediaSourceId));
//                 }
//
//                 if (event.data.chromeExtensionStatus) {
//                     callback(event.data.chromeExtensionStatus, null, getScreenConstraints(event.data.chromeExtensionStatus));
//                 }
//
//                 // this event listener is no more needed
//                 window.removeEventListener('message', onIFrameCallback);
//             }
//
//     setTimeout(postGetSourceIdMessage, 100);
//         };
//
//
//         function getScreenConstraints(error, sourceId) {
//             var screen_constraints = {
//                 audio: false,
//                 video: {
//                     mandatory: {
//                         chromeMediaSource: error ? 'screen' : 'desktop',
//                         maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
//                         maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
//                     },
//                     optional: []
//                 }
//             };
//             console.log("Screen constraints original: ")
//             console.log(screen_constraints)
//
//             if (sourceId) {
//                 screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
//             }
//
//             return screen_constraints;
//         }
//
//         function postGetSourceIdMessage() {
//     if (!iframe) {
//                 loadIFrame(postGetSourceIdMessage);
//                 return;
//             }
//
//             if (!iframe.isLoaded) {
//                 setTimeout(postGetSourceIdMessage, 100);
//                 return;
//             }
//
//             iframe.contentWindow.postMessage({
//                 captureSourceId: true
//             }, '*');
//         }
//
//         var iframe;
//
//         // this function is used in RTCMultiConnection v3
//         window.getScreenConstraints = function(callback) {
//             loadIFrame(function() {
//               //??
//                 window.getScreenId(function(error, sourceId, screen_constraints) {
//                     callback(error, screen_constraints.video);
//                 });
//             });
//         };
//
//     function loadIFrame(loadCallback) {
//             if (iframe) {
//                 loadCallback();
//                 return;
//             }
//
//             iframe = document.createElement('iframe');
//             iframe.onload = function() {
//                 iframe.isLoaded = true;
//
//                 loadCallback();
//             };
//             iframe.src = 'https://www.webrtc-experiment.com/getSourceId/'; // https://wwww.yourdomain.com/getScreenId.html
//             //iframe.src = './getScreenId.html/'
//             iframe.style.display = 'none';
//             (document.body || document.documentElement).appendChild(iframe);
//         }
//
//     window.getChromeExtensionStatus = function(callback) {
//             // for Firefox:
//             if (!!navigator.mozGetUserMedia) {
//                 callback('installed-enabled');
//                 return;
//             }
//
//             window.addEventListener('message', onIFrameCallback);
//
//             function onIFrameCallback(event) {
//                 if (!event.data) return;
//
//     if (event.data.chromeExtensionStatus) {
//                     callback(event.data.chromeExtensionStatus);
//                 }
//
//                 // this event listener is no more needed
//                 window.removeEventListener('message', onIFrameCallback);
//             }
//
//     setTimeout(postGetChromeExtensionStatusMessage, 100);
//         };
//
//     function postGetChromeExtensionStatusMessage() {
//             if (!iframe) {
//                 loadIFrame(postGetChromeExtensionStatusMessage);
//                 return;
//             }
//
//             if (!iframe.isLoaded) {
//                 setTimeout(postGetChromeExtensionStatusMessage, 100);
//                 return;
//             }
//
//     iframe.contentWindow.postMessage({
//                 getChromeExtensionStatus: true
//             }, '*');
//         }
//     })();
// //**
//
// //**Final screen share code
// var maxTries = 0;
//     function showChromeExtensionStatus() {
//       if(typeof window.getChromeExtensionStatus !== 'function') return;
//
//       var gotResponse;
//       window.getChromeExtensionStatus(function(status) {
//         gotResponse = true;
//         //??document.getElementById('chrome-extension-status').innerHTML = 'Chrome extension status is: <b>' + status + '</b>';
//         console.info('getChromeExtensionStatus', status);
//       });
//
//       maxTries++;
//       if(maxTries > 15) return;
//       setTimeout(function() {
//         if(!gotResponse) showChromeExtensionStatus();
//       }, 1000);
//     }
//
//     showChromeExtensionStatus();
//
//             // via: https://bugs.chromium.org/p/chromium/issues/detail?id=487935#c17
//             // you can capture screen on Android Chrome >= 55 with flag: "Experimental ScreenCapture android"
//             window.IsAndroidChrome = false;
//             try {
//                 if (navigator.userAgent.toLowerCase().indexOf("android") > -1 && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
//                     window.IsAndroidChrome = true;
//                 }
//             } catch (e) {}
//
//             document.getElementById('capture-screen').onclick = function() {
//                 console.log("EXECUTING NOW")
//                 document.getElementById('capture-screen').disabled = true;
//
//                 setTimeout(function() {
//                   if(document.getElementById('capture-screen').disabled && !document.querySelector('video').src) {
//                     document.getElementById('capture-screen').disabled = false;
//                   }
//                 }, 5000);
//
//     //ONCLICK!!!
//                 //??
//                 window.getScreenId(function(error, sourceId, screen_constraints) {
//                     // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
//                     // sourceId == null || 'string' || 'firefox'
//                     // getUserMedia(screen_constraints, onSuccess, onFailure);
//                     console.log("SourceId: " ,sourceId);
//                     console.log("Test screen constraints", screen_constraints)
//                     document.getElementById('capture-screen').disabled = false;
//
//                     // if (IsAndroidChrome) {
//                     //     screen_constraints = {
//                     //         mandatory: {
//                     //             chromeMediaSource: 'screen'
//                     //         },
//                     //         optional: []
//                     //     };
//                     //
//                     //     screen_constraints = {
//                     //         video: screen_constraints
//                     //     };
//                     //
//                     //     error = null;
//                     // }
//
//                     if(error == 'not-installed') {
//                       alert('Please install Chrome extension. See the link below.');
//                       return;
//                     }
//
//                     if(error == 'installed-disabled') {
//                       alert('Please install or enable Chrome extension. Please check "chrome://extensions" page.');
//                       return;
//                     }
//
//                     if(error == 'permission-denied') {
//                       alert('Please make sure you are using HTTPs. Because HTTPs is required.');
//                       return;
//                     }
//
//                     console.info('getScreenId callback \n(error, sourceId, screen_constraints) =>\n', error, sourceId, screen_constraints);
//
//                     document.getElementById('capture-screen').disabled = true;
//                     navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
//                     console.log("Constraints passed to getUserMedia: ", screen_constraints)
//                     navigator.getUserMedia(screen_constraints, function(stream) {
//                         // share this "MediaStream" object using RTCPeerConnection API
//
//                         ///////
//                         //ADD STREAMS HERE!!!
//                         //////
//                         // Example from the author:
//                         //   peer.addStream( stream );
//                         //   peer.createOffer(.....);
//
//                         //window.postMessage(screen_constraints, window.location.origin)
//                         console.log("screen constraints: ", screen_constraints)
//                         window.postMessage(screen_constraints.video.mandatory.chromeMediaSourceId, window.location.origin)
//                         stream.oninactive = stream.onended = function() {
//                             console.log("STREAM ENDED!")
//                             //??will this work?
//                             //this.props.VideoControl('local', this.props.localVideos[0].video.index, this.props.localVideos, this.props.remoteVideos)
//                              //document.querySelector('video').src = null;
//                              document.getElementById('sharing').src = null;
//                              this_main.stopSharingScreen()
//                             //document.querySelector('video').src = prevIndex
//                             document.getElementById('capture-screen').disabled = false;
//                         };
//
//                         document.getElementById('capture-screen').disabled = false;
//                     }, function(error) {
//                         console.error('getScreenId error', error);
//                         console.log('Failed to capture your screen. Please check Chrome console logs for further information.')
//                         //alert('Failed to capture your screen. Please check Chrome console logs for further information.');
//                     });
//                 });
//             };
// //**

//**Older version::


    //////////////////////////////
    window.addEventListener('message', (event) => {
      console.log("RECEIVED EVENT: ", typeof event)
      console.log(event)

      console.log("window location origin: ")
      console.log(window.location.origin)
      console.log("event origin: ", event.origin)
      console.log("event data outside: ", event)

      //if (event.origin === window.location.origin) {
        if (event.data.chromeMediaSourceId) {
          console.log("GOT CHROME ID")
        console.log("event")
        //??console.log(event.data.sourceId)
        console.log(event)
        console.log("Chrome id: " , event.data.chromeMediaSourceId)
        //??if (typeof event.data.sourceId === 'string') {
          //if (event.data.chromeMediaSourceId && typeof event.data.chromeMediaSourceId === 'string' && !this.props.isSharingScreen) {
          if (event.data.chromeMediaSourceId && !this.props.isSharingScreen) {
            console.log(event.data.chromeMediaSourceId)

          this.props.startScreenshare(event.data.chromeMediaSourceId);
          //Nothing in local videos, so throws error. Fix this.
          //this.props.VideoControl('local', this.props.localVideos[0].video.index, this.props.localVideos, this.props.remoteVideos)
          console.log("actually starting screenshare in listener")
        }
      }
    }, false);

    ///////////////////////Screenshare codes start
    const this_main = this;
    (function() {
        window.getScreenId = function(callback) {
            // for Firefox:
            // sourceId == 'firefox'
            // screen_constraints = {...}
            if (!!navigator.mozGetUserMedia) {
                callback(null, 'firefox', {
                    video: {
                        mozMediaSource: 'window',
                        mediaSource: 'window'
                    }
                });
                return;
            }

            window.addEventListener('message', onIFrameCallback);

            function onIFrameCallback(event) {
                if (!event.data) return;

                if (event.data.chromeMediaSourceId) {
                  console.log("GOT A CHROMEMEDIASOURCEID")
                    if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
                        callback('permission-denied');
                    } else callback(null, event.data.chromeMediaSourceId, getScreenConstraints(null, event.data.chromeMediaSourceId));
                }

                if (event.data.chromeExtensionStatus) {
                    callback(event.data.chromeExtensionStatus, null, getScreenConstraints(event.data.chromeExtensionStatus));
                }

                // this event listener is no more needed
                window.removeEventListener('message', onIFrameCallback);
            }

    setTimeout(postGetSourceIdMessage, 100);
        };

        function getScreenConstraints(error, sourceId) {
            var screen_constraints = {
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: error ? 'screen' : 'desktop',
                        maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                        maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
                    },
                    optional: []
                }
            };
            console.log("Screen constraints original: ")
            console.log(screen_constraints)

            if (sourceId) {
                screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
            }

            return screen_constraints;
        }

        function postGetSourceIdMessage() {
    if (!iframe) {
                loadIFrame(postGetSourceIdMessage);
                return;
            }

            if (!iframe.isLoaded) {
                setTimeout(postGetSourceIdMessage, 100);
                return;
            }

            iframe.contentWindow.postMessage({
                captureSourceId: true
            }, '*');
        }

        var iframe;

        // this function is used in RTCMultiConnection v3
        window.getScreenConstraints = function(callback) {
            loadIFrame(function() {
              //??
                window.getScreenId(function(error, sourceId, screen_constraints) {
                    callback(error, screen_constraints.video);
                });
            });
        };

    function loadIFrame(loadCallback) {
            if (iframe) {
                loadCallback();
                return;
            }

            iframe = document.createElement('iframe');
            iframe.onload = function() {
                iframe.isLoaded = true;

                loadCallback();
            };
            iframe.src = 'https://www.webrtc-experiment.com/getSourceId/'; // https://wwww.yourdomain.com/getScreenId.html
            //iframe.src = './getScreenId.html/'
            iframe.style.display = 'none';
            (document.body || document.documentElement).appendChild(iframe);
        }

    window.getChromeExtensionStatus = function(callback) {
            // for Firefox:
            if (!!navigator.mozGetUserMedia) {
                callback('installed-enabled');
                return;
            }

            window.addEventListener('message', onIFrameCallback);

            function onIFrameCallback(event) {
                if (!event.data) return;

    if (event.data.chromeExtensionStatus) {
                    callback(event.data.chromeExtensionStatus);
                }

                // this event listener is no more needed
                window.removeEventListener('message', onIFrameCallback);
            }

    setTimeout(postGetChromeExtensionStatusMessage, 100);
        };

    function postGetChromeExtensionStatusMessage() {
            if (!iframe) {
                loadIFrame(postGetChromeExtensionStatusMessage);
                return;
            }

            if (!iframe.isLoaded) {
                setTimeout(postGetChromeExtensionStatusMessage, 100);
                return;
            }

    iframe.contentWindow.postMessage({
                getChromeExtensionStatus: true
            }, '*');
        }
    })();

    /////////////////////////////////////////////////subsetstart


    /////////////////////////////////////////////////subsetend
    var maxTries = 0;
    function showChromeExtensionStatus() {
      if(typeof window.getChromeExtensionStatus !== 'function') return;

      var gotResponse;
      window.getChromeExtensionStatus(function(status) {
        gotResponse = true;
        //??document.getElementById('chrome-extension-status').innerHTML = 'Chrome extension status is: <b>' + status + '</b>';
        console.info('getChromeExtensionStatus', status);
      });

      maxTries++;
      if(maxTries > 15) return;
      setTimeout(function() {
        if(!gotResponse) showChromeExtensionStatus();
      }, 1000);
    }

    showChromeExtensionStatus();

            // via: https://bugs.chromium.org/p/chromium/issues/detail?id=487935#c17
            // you can capture screen on Android Chrome >= 55 with flag: "Experimental ScreenCapture android"
            window.IsAndroidChrome = false;
            try {
                if (navigator.userAgent.toLowerCase().indexOf("android") > -1 && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
                    window.IsAndroidChrome = true;
                }
            } catch (e) {}

            document.getElementById('capture-screen').onclick = function() {
                console.log("EXECUTING NOW")
                document.getElementById('capture-screen').disabled = true;

                setTimeout(function() {
                  if(document.getElementById('capture-screen').disabled && !document.querySelector('video').src) {
                    document.getElementById('capture-screen').disabled = false;
                  }
                }, 5000);

    //ONCLICK!!!
                //??
                window.getScreenId(function(error, sourceId, screen_constraints) {
                    // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
                    // sourceId == null || 'string' || 'firefox'
                    // getUserMedia(screen_constraints, onSuccess, onFailure);

                    document.getElementById('capture-screen').disabled = false;

                    // if (IsAndroidChrome) {
                    //     screen_constraints = {
                    //         mandatory: {
                    //             chromeMediaSource: 'screen'
                    //         },
                    //         optional: []
                    //     };
                    //
                    //     screen_constraints = {
                    //         video: screen_constraints
                    //     };
                    //
                    //     error = null;
                    // }

                    if(error == 'not-installed') {
                      alert('Please install Chrome extension. See the link below.');
                      return;
                    }

                    if(error == 'installed-disabled') {
                      alert('Please install or enable Chrome extension. Please check "chrome://extensions" page.');
                      return;
                    }

                    if(error == 'permission-denied') {
                      alert('Please make sure you are using HTTPs. Because HTTPs is required.');
                      return;
                    }

                    console.info('getScreenId callback \n(error, sourceId, screen_constraints) =>\n', error, sourceId, screen_constraints);

                    document.getElementById('capture-screen').disabled = true;
                    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
                    navigator.getUserMedia(screen_constraints, function(stream) {
                        // share this "MediaStream" object using RTCPeerConnection API

                        ///////
                        //ADD STREAMS HERE!!!
                        //////
                        // Example from the author:
                        //   peer.addStream( stream );
                        //   peer.createOffer(.....);

                        //Original way
                        //??document.querySelector('video').src = URL.createObjectURL(stream);

                        document.getElementById('sharing').src = URL.createObjectURL(stream);
                        //document.getElement("div.main-video div video").src = URL.createObjectURL(stream)
                        //this2.props.startScreenshare(stream.id);
                        window.postMessage(stream.id, window.location.origin);
                        stream.oninactive = stream.onended = function() {
                            console.log("STREAM ENDED!")
                            //??will this work?
                            //this.props.VideoControl('local', this.props.localVideos[0].video.index, this.props.localVideos, this.props.remoteVideos)
                             //document.querySelector('video').src = null;
                             document.getElementById('sharing').src = null;
                             this_main.stopSharingScreen()
                            //document.querySelector('video').src = prevIndex
                            document.getElementById('capture-screen').disabled = false;
                        };

                        document.getElementById('capture-screen').disabled = false;
                    }, function(error) {
                        console.error('getScreenId error', error);

                        alert('Failed to capture your screen. Please check Chrome console logs for further information.');
                    });
                });
            };



    ///////////////////////////////////////// screenshare end




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
      const matchedConnection = this.props.remoteVideos.find((connection) => {
        let participantId = connection.participantJid;
        participantId = participantId.substring(participantId.indexOf("/")+1, participantId.indexOf("@iris-meet.comcast.com"))
        //participantId = participantId.substring(0, participantId.indexOf("/"))
        dominantSpeakerEndpoint = dominantSpeakerEndpoint.substring(0, dominantSpeakerEndpoint.lastIndexOf("@"))
        const endPoint = participantId.substring(participantId.lastIndexOf("/")+1)
        console.log("endpoint and dom: " + endPoint + ", " + dominantSpeakerEndpoint)
        return endPoint === dominantSpeakerEndpoint;
    });

    console.log('FOUND DOMINANT SPEAKER: ');
    console.log(matchedConnection);
    if (matchedConnection) {
      this.props.VideoControl('remote', matchedConnection.id, this.props.localVideos, this.props.remoteVideos)
      this.props.changeDominantSpeaker(matchedConnection.id)

    } else if (this.props.localVideos.length > 0) {
      // no remote participants found so assume it is local speaker
      this.props.VideoControl('local', this.props.localVideos[0].id, this.props.localVideos, this.props.remoteVideos)
      //??
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
    const hostname = window.location.href;
    const urlString = hostname.substring(0, hostname.lastIndexOf("/"));
    window.location.assign(urlString);
  }

  _isDominant(index) {
    console.log(index === this.props.dominantSpeakerIndex)
    return index === this.props.dominantSpeakerIndex;
  }


  render() {

    return (
      <div onMouseMove={this._onMouseMove.bind(this)}>
      {this.props.localVideos.length > 0 ?
        <MeetToolbar
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
            audio={this.props.connection.audio}
          /> : null
        }
        {this.props.videoType === 'local' ?
          <LocalVideo
            video={this.props.localVideos[0]}
            audio={this.props.connection.audio}
          /> : null
        }
      </MainVideo>

      <HorizontalWrapper isHidden={this.state.isVideoBarHidden}>
          {this.props.localVideos.map((connection) => {
            console.log('LOCAL CONNECTION');
            console.log(connection);

            return !this._isDominant(connection.id) ? (
              <HorizontalBox
                key={connection.id}
                type='local'
                id={connection.id}
                localVideos = {this.props.localVideos}
                remoteVideos = {this.props.remoteVideos}
              >
                <LocalVideo key={connection.id} video={connection} audio={connection.audio} />
              </HorizontalBox>
            )
            : ( <BlackBox
              key={connection.id}
              userName={this.props.userName}
              type='local'
              id={connection.id}
              localVideos={this.props.localVideos}
              remoteVideos = {this.props.remoteVideos}> </BlackBox>  ) ;
          })}
          {this.props.remoteVideos.map((connection) => {


            if (connection) {
              return !this._isDominant(connection.id) ? (
                <HorizontalBox
                  key={connection.id}
                  type='remote'
                  id={connection.id}
                  localVideos = {this.props.localVideos}
                  remoteVideos = {this.props.remoteVideos}
                >
                  <RemoteVideo key={connection.id} video={connection} audio={connection.audio} />
                </HorizontalBox>
              )
              : ( <BlackBox
                key={connection.id}
                userName={this.props.userName}
                type='remote'
                id={connection.id}
                localVideos={this.props.localVideos}
                remoteVideos={this.props.remoteVideos} > </BlackBox> ) ;
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
  })));
