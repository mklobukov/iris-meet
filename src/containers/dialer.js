import React from 'react';
import { IrisDialer } from 'iris-react-webrtc';
import { AuthManager } from 'iris-auth-js-sdk';
const uuidV1 = require('uuid/v1');
import Config from '../../config.json';
import { getRoomId } from '../api/RoomId';
import Paper from 'material-ui/Paper';

import withWebRTC, { WebRTCConstants } from 'iris-react-webrtc'

export default withWebRTC(class Example extends React.Component {
  constructor(props) {
    super(props);

    if (Config.dialer) {
      this.state = {
        accessToken : "Token from auth manager",
        decodedToken : "Decoded token from auth manager",
        routingId : uuidV1() + '@' + Config.dialer.domain,
        fromTN : "+12674550136",
        toTN: "Destination number",
        cname : "Nijaguna",
        roomName: "irisdialerroom",
        userName: "Iris User",
        callInProgress: false,
        remoteStream : {}
      };
    this.onRemoteStream = this.onRemoteStream.bind(this);
    this.onCalleeLeft = this.onCalleeLeft.bind(this);
    this._initializeAndLogin();
    }
  }

  componentDidMount() {
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteStream);
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, this.onCalleeLeft);
  }
  componentWillUnmount() {
    this.props.removeWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteStream);
    this.props.leaveRoom();
  }

  onRemoteStream(stream) {
    console.log("Got a remote stream: ", stream)
    this.setState({remoteStream : stream });
    let element = document.getElementById("remoteAudioStream");
    if (!element || !stream) {
      console.log("Element or stream is null");
      return;
    }
    if (typeof element.src !== 'undefined') {
      element.src = URL.createObjectURL(stream);
    } else if (typeof element.srcObject !== 'undefined') {
      element.srcObject = stream;
    } else if (typeof element.mozSrcObject !== 'undefined') {
      element.mozSrcObject = stream;
    } else {
      console.log('Error attaching stream to element.');
    }
  }

  onCalleeLeft(data) {
    this.props.endSession();
    this.setState({callInProgress: false}, () => {console.log("Callee left -- hanging up")})
  }

  _initializeAndLogin(){
    const routingId = this.state.routingId;
    const appKey = Config.dialer.appKey;
    const aumUrl = Config.authUrl;
    this._login(routingId, appKey, aumUrl)
  }

  _login(routingId, appKey, aumUrl) {
    let authApi = new AuthManager({'managementApiUrl': aumUrl, 'appkey': appKey});
    return authApi.anonymousLoginAsync(routingId).then(
      data => {
        console.log("DATA: ", data)
        this.setState({
          accessToken : data.Token,
          decodedToken : authApi.decodeToken(data.Token)
        });
      }
    )
    .catch(
      error => {console.log("Dialer: Error logging in  -- " + error);
      })
  }

 numberIsValid(num) {
   if ((num.indexOf("+1") !== -1 && num.length < 12) ||
      (num.indexOf("+1") === -1 && num.length < 10) ||
      (num.match(/[a-z]/i)) )   {
     return false
   }

   if (num.indexOf("+1") === -1) {
     this.setState({toTN: "+1" + num});
   }
   return true
}

_updateToTN(num) {
  this.setState({toTN: num}, () => console.log("updated number: ", this.state.toTN))
}

  _onDial() {
    if (this.state.callInProgress) {
      this.props.endSession()
      this.setState({callInProgress: false}, () => {console.log("Hanging up")})
      return
    }

    getRoomId(this.state.roomName, this.state.accessToken)
    .then((response) => {
      const roomId = response.room_id;
      if (!this.numberIsValid(this.state.toTN)) {
        console.log("\n\nERROR in Iris Dialer: Invalid number format \n\n");
        return
      }

      //ToTN is not defined in the config. Need to somehow grab it from dialer
      const config = {
        fromTN: this.state.fromTN,
        userName: this.state.userName,
        roomId: roomId,
        roomName: this.state.roomName,
        domain: this.state.decodedToken.payload['domain'].toLowerCase(),
        token: this.state.accessToken,
        routingId: uuidV1(),
        toRoutingId: this.state.toTN,
        toTN: this.state.toTN,
        hosts: {
          eventManagerUrl: Config.eventManagerUrl,
          notificationServer: Config.notificationServer,
          UEStatsServer: Config.UEStatsServer,
        },
        cname: this.state.cname,
        isPSTN: true,
        streamType: "audio",
        callType: "audio",
        type: "pstn",
      }
      this.props.initializeWebRTC(config)
      this.setState({callInProgress: true}, () => {console.log("Starting call")} )
    })
  }

  render() {

    return (

      Config.dialer ?
      (  <div className="dialer-main">
          <IrisDialer
            onDial={this._onDial.bind(this)}
            maxNumberLength={16}
            updateToTN={this._updateToTN.bind(this)}
            displayStatusBox={false}
            />
        </div>
      ) :
      <div>Dialer disabled: no config provided</div>

    );
  }
})
