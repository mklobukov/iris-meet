import React, { Component } from 'react';
import DialPad from './DialPad';
import DisplayNumber from './DisplayNumber';
import StatusText from './StatusText';
import RemoteAudio from './RemoteAudio'
import './css/style.css';
import Paper from 'material-ui/Paper';

import Config from '../../../config.json';
const config = Config.dialer;

require('iris-js-sdk');

var IrisRtcConnection = window.IrisRtcConnection;
var IrisRtcStream = window.IrisRtcStream;
var IrisRtcSession = window.IrisRtcSession;
var IrisRtcConfig = window.IrisRtcConfig;
var Logger = window.IrisRtcLogger;

// var IrisEventManager = window.IrisEventManager;


var irisRtcConnection = null;
var irisRtcStream = null;
var irisRtcSession = null;



const checkStatus = (response) => {
  console.log('response status: ' + response.status);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

const parseJSON = (response) => {
  return response.json();
}

class IrisDialer extends Component {

  constructor(props){
    super(props);
    this.state = {
      number : "",
      onCall:false,
      onMute:false,
      onHold:false,
      statusText:"Dial a number",
      localStream:null,
      remoteStream:null,
    }
    this.onDialDigit = this.onDialDigit.bind(this);
    this.onDial = this.onDial.bind(this);
    this.onDeleteDigit = this.onDeleteDigit.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
  }



  render() {
    console.log("WINDOW: ", window)
    console.log(this.props);
    return (
      <div className="iris-dialer-app">
        <div className="container">
           <DisplayNumber number={this.state.number}
             onNumberChange={this.onNumberChange}/>
          <DialPad number={this.state.number}
            onDialDigit={this.onDialDigit}
            onDeleteDigit={this.onDeleteDigit}
            onMuteUnmute={this.onMuteUnmute}
            onDial={this.onDial}
            onTextChange={this.onTextChange}
            onCall={this.state.onCall}
            onMute={this.state.onMute}/>
          <StatusText number={this.state.number} statusText={this.state.statusText}/>
          <RemoteAudio />
        </div>
      </div>
    );
  }


  onDialDigit(number){
    console.log("Number : " + number);
    this.setState({number : number, statusText:"Dialing"});
  }

  onDeleteDigit(){
    let number = this.state.number.slice(0, -1);
    console.log("Number : " + number);

    this.setState({number : number});
  }

  onDial(){
    config.routingId = this.props.config.routingId;
    config.irisToken = this.props.config.irisToken;
    config.fromTN = this.props.config.fromTN;
    config.cname = this.props.config.cname;


      if(this.state.onCall){
        //this.irisRtcSession.endSession();
        IrisRtcSession.endSession();
      }else {

        let toTN = this.state.number;
        if((toTN.indexOf("+1") !== -1 && toTN.length < 12) || (toTN.indexOf("+1") === -1 && toTN.length < 10) ){
          Logger.log(Logger.level.ERROR, "IrisDialer", "Please check dialed number");
        }else{
          if (toTN.indexOf("+1") === -1) {
            this.setState({number : "+1" + toTN});
            config.toTN = toTN;
          }
          config.toRoutingId = config.toTN + '@' + config.domain;
          this.irisConnect(config.irisToken, config.routingId);
        }
      }

  }

  onNumberChange(event){

    this.setState({number : event.target.value, statusText:"Dialing"});


    // if (this.state.number.indexOf("+1") === -1) {
    //   this.setState({number : "+1" + this.state.number});
    //   config.toTN = this.state.number;
    // }
    config.toRoutingId = config.toTN + '@' + config.domain;
  }

  onMuteUnmute(){
    this.setState({onMute:irisRtcSession.isAudioMuted()});
    this.irisRtcSession.audioMuteToggle();
    this.setState({onMute:irisRtcSession.isAudioMuted()});
  }

  onHoldUnhold(){
    if(this.irisRtcSession){
      this.irisRtcSession.pstnHold();
      this.setState({onHold:irisRtcSession.isPstnOnHold()});
    }
  }

  irisConnect(irisToken, routingId){

    irisRtcConnection = new IrisRtcConnection();

    IrisRtcConfig.updateConfig(config);

    irisRtcConnection.connect(irisToken, routingId);

    irisRtcConnection.onConnected = () => {
      this.irisStream(irisRtcConnection);
    }

    irisRtcConnection.onNotification = (notificationInfo) =>{

    }

    irisRtcConnection.onConnectionFailed = () => {

    }

    irisRtcConnection.onClose = () => {

    }

    irisRtcConnection.onEvent = () => {

    }

    irisRtcConnection.onError = () => {

    }
}

irisStream(connection){
   irisRtcStream = new IrisRtcStream();

  let streamConfig ={
    streamType : "audio"
  }

  irisRtcStream.createStream(streamConfig);

  irisRtcStream.onLocalStream = (stream) => {
    this.setState({localStream : stream});
    this.irisSession(connection, stream);
  }
}


irisSession(connection, stream){

  irisRtcSession = new IrisRtcSession();

  config.participants = [];
  config.participants.push({
    "history": true,
    "notification": true,
    "owner": true,
    "room_identifier": true,
    "routing_id": config.routingId
  });

  config.participants.push({
    "history": true,
    "notification": true,
    "owner": true,
    "room_identifier": true,
    "routing_id": config.toRoutingId
  });

  let userData = JSON.stringify({
    "data": {
      "cid": config.fromTN,
      "cname": config.cname
    }
  });


  if(config.useAnonymous){

    fetch("https://"+config.urls.eventManager + "/v1/createroom/room/"+config.roomName, {
      method : "PUT",
      headers : {
        "Authorization": "Bearer " + config.irisToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"participants":""})
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((response) => {
      let roomId = response.room_id;
      config.roomId = roomId;
      config.userData = userData ? userData : "";

      irisRtcSession.createSession(config, connection, stream);
    })
    .catch((error) => {
      Logger.log(Logger.level.ERROR, "IrisDialer", "Error while getting roomid ", error);
    })

  }else{

    fetch("https://"+config.urls.eventManager +"/v1/createroom/participants", {
      method : "PUT",
      headers : {
        "Authorization": "Bearer " + config.irisToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"participants":config.participants})
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((response) => {
      let roomId = response.room_id;
      config.roomId = roomId;
      config.userData = userData ? userData : "";

      irisRtcSession.createSession(config, connection, stream);
    })
    .catch((error) => {
      Logger.log(Logger.level.ERROR, "IrisDialer", "Error while getting roomid ", error);
      console.error("");
    });
  }
  irisRtcSession.onRemoteStream = (stream) => {
    Logger.log(Logger.level.INFO, "IrisDialer", "onRemoteStream :: Remote Audio Stream is received ", stream);

    this.setState({remoteStream: stream});

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

  irisRtcSession.onSessionCreated = () =>{
    this.setState({onCall:true});
  }

  irisRtcSession.onSessionConnected = () =>{

  }

  irisRtcSession.onSessionParticipantJoined = () =>{

  }

  irisRtcSession.onSessionParticipantLeft = () =>{
    this.setState({onCall:false});

  }

  irisRtcSession.onError = () =>{

  }
  irisRtcSession.onEvent = () =>{

  }

  irisRtcSession.onSessionEnd = (sessionId) =>{
    this.setState({onCall:false});
  }

}

}



export default IrisDialer;
