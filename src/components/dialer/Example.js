import React, {Component} from 'react';
import IrisDialer from './IrisDialer';
import { AuthManager } from 'iris-auth-js-sdk';

import config from './config.json';
var uuidV1 = require('uuid/v1');

var IrisAuthManager = window.IrisAuthManager;
var IrisEventManager = window.IrisEventManager;

class Example extends Component{

  constructor(props){
    super(props);

    this.state = {
      "irisToken" : "irisToken from iris authManager",
      "routingId":"Unique id of participant",
      "fromTN":"+12674550136",
      "cname":"Nijaguna"
    };
    this.init();
  }

  render() {
    return (
      <div className="App-main">
        <h2 className="">Iris Dialer App</h2>
        <IrisDialer config={{
            "irisToken":this.state.irisToken,
            "routingId":this.state.routingId,
            "fromTN":this.state.fromTN,
            "cname":this.state.cname
          }}/>
      </div>
    );
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


init(){

  console.log(localStorage.getItem('irisMeet.userName'))
  let routingId = uuidV1() + "@" + config.domain;
  console.log("Routing id: " , routingId)
  let appKey = config.appKey;
  let aumUrl = config.urls.authManager;
  console.log(aumUrl)
  config.routingId = routingId;
  console.log("WINDOW print: ", window)

  this._login(routingId, appKey, aumUrl)
  // IrisAuthManager.anonymousLogin(routingId, appKey, aumUrl, (res) => {
  //   console.log(res);
  //     if (200 <= res.statusCode <= 300) {
  //         config.irisToken = res.body.Token;
  //         if(config.irisToken){
  //           this.setState({
  //             "irisToken" : config.irisToken,
  //             "routingId":config.routingId
  //           });
  //         }
  //     } else {
  //         console.log("Anonymous login failed")
  //     }
  // });

}

}

export default Example;
