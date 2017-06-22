//This file will serve as a container for the dialer for experimental purposes
//this is the client-side file. It imports the dialer from react-sdk and passes
//it the props necessary to make calls.


import React, {Component} from 'react';
import IrisDialer from './IrisDialer';
import { AuthManager } from 'iris-auth-js-sdk';
import Paper from 'material-ui/Paper';
import IrisDialerTest from 'iris-react-webrtc'
const uuidV1 = require('uuid/v1');
import Config from '../../../config.json';
const config = Config.dialer;
import { getRoomId } from '../../api/RoomId';

import withWebRTC, { WebRTCConstants } from 'iris-react-webrtc'


export default withWebRTC(class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken : "Token from auth manager",
      decodedToken : "Decoded token from auth manager",
      routingId : uuidV1() + '@' + Config.dialer.domain,
      fromTN : "+12674550136",
      cname : "Nijaguna",
      roomName: "dialerRoom",
      userName: "Test username",
      config: Config.dialer,
      remoteStream : {}
    };
    this._initializeAndLogin();
  }

  componentDidMount() {
    this.props.addWebRTCListener(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, this.onRemoteStream);
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

  _initializeAndLogin(){
    let routingId = this.state.routingId;
    let appKey = this.state.config.appKey;
    let aumUrl = this.state.config.urls.authManager;
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

  _onDial() {
    console.log("Inside onDial")
    getRoomId(this.state.roomName, this.state.accessToken)
    .then((response) => {
      console.log("Response from getroomId: ", response);
      const roomId = response.room_id;

      // let config = {
      //   userName: this.props.userName,
      //   roomId: roomId,
      //   roomName: this.props.roomName,
      //   domain: this.state.decodedToken.payload['domain'].toLowerCase(),
      //   token: this.state.accessToken,
      //   routingId: config.toTN + '@' + config.domain,
      //   hosts: {
      //     eventManagerUrl: Config.eventManagerUrl,
      //     notificationServer: Config.notificationServer
      //   }
      // }


      //ToTN is not defined in the config. Need to somehow grab it from dialer
      const config = {
        fromTN: this.state.fromTN,
        userName: this.state.userName,
        roomId: roomId,
        roomName: this.state.roomName,
        domain: this.state.decodedToken.payload['domain'].toLowerCase(),
        token: this.state.accessToken,
        routingId: uuidV1(),
        toRoutingId: "2155002978",
        toTN: "2155002978",
        hosts: {
          eventManagerUrl: Config.eventManagerUrl,
          notificationServer: Config.notificationServer
        },
        cname: this.state.cname,
        isPSTN: true,
        streamType: "audio",
        callType: "audio",
        type: "pstn",
      }

      console.log("CONFIG: ", config)
      this.props.initializeWebRTC(config)
    })
  }


  render() {
    console.log("Current state: ", this.state)
    return (

      <div className="dialer-main">
        <IrisDialer
          onDial={this._onDial.bind(this)}
          />
    </div>

    );
  }
})
