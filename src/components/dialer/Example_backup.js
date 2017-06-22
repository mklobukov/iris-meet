//This file will serve as a container for the dialer for experimental purposes
//this is the client-side file. It imports the dialer from react-sdk and passes
//it the props necessary to make calls.


import React, {Component} from 'react';
import IrisDialer from './IrisDialer';
import { AuthManager } from 'iris-auth-js-sdk';
import Paper from 'material-ui/Paper';
import IrisDialerTest from 'iris-react-webrtc'

import Config from '../../../config.json';
const config = Config.dialer;
const uuidV1 = require('uuid/v1');


const paperStyle = {
  "width" : "320px",
  "justifyContent" : "center",
  "paddingBottom" : "20px",
  "paddingTop" : "10px",
}

class Example extends Component{
  constructor(props){
    super(props);
    this.state = {
      "irisToken" : "irisToken from iris authManager",
      "routingId":"Unique id of participant",
      "fromTN":"+12674550136",
      "cname":"Nijaguna"
    };
    this._initializeAndLogin();
  }

  render() {
    console.log("DIALER TEEST: ", IrisDialerTest)
    return (
      <div className="dialer-main">
        <IrisDialer config={{
            "irisToken":this.state.irisToken,
            "routingId":this.state.routingId,
            "fromTN":this.state.fromTN,
            "cname":this.state.cname
          }}/>
    </div>

    );
  }

  _initializeAndLogin(){
    let routingId = uuidV1() + "@" + config.domain;
    let appKey = config.appKey;
    let aumUrl = config.urls.authManager;
    config.routingId = routingId;
    this._login(routingId, appKey, aumUrl)
  }

  _login(routingId, appKey, aumUrl) {
    let authApi = new AuthManager({'managementApiUrl': aumUrl, 'appkey': appKey});
    return authApi.anonymousLoginAsync(routingId).then(
      data => {
        console.log("DATA: ", data)
        this.setState({
          "irisToken" : data.Token,
          "routingId" : routingId,
        });
      }
    )
    .catch(
      error => {console.log("Error logging in  -- " + error);
      })
  }

  _onNumberChange(e) {
    this.setState({number: e.target.value,
                   statusText: "Dialing" });

                   //??????
    config.toRoutingId = config.toTN + '@' + config.domain;
  }



  // -- onMuteUnmute
  // -- onHoldUnhold
  // -- onNumberChange
  // -- onDial
  //   *--- calls irisConnect
  //     *-- calls irisStream
  //       *- calls irisSession


}

export default Example;
