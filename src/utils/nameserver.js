import Fetch from 'isomorphic-fetch';

nameServerUrl = "localhost:12345/app/" //this may need to be put in diff file

export class NameServer {
  constructor(config) {
    this.config = config;
  }

  _checkStatus(response) {
    console.log('response status: ' + response.status);
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  _parseJSON(response) {
    return response.json();
  }

  getAllUsers() {
    const requestHeader = new Headers();
    requestHeader.append('Content-Type', 'application/json');
    requestHeader.append('X-App-Key', this.config.appkey);
    //do I need any authentication inside? Probably.
    //probably iris-meet needs to be where the jwt is coming from , not name-server
    return fetch(this.config.nameServerUrl + "/app/" + this.config.classname + "/userid/", {
      method: 'GET',
      headers: requestHeader,
      body: '',
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
  }

  getUserByJid(userJid) {
    const requestHeader = new Headers();
    requestHeader.append('Content-Type', 'application/json');
    requestHeader.append('X-App-Key', this.config.appkey);
    return fetch(this.config.nameServerUrl + "/app/" + this.config.className + "/userid/" + userJid + "/", {
      method: 'GET',
      headers: requestHeader,
      body: '',
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
  }

  addOrUpdateUser(userJid, name) {
    const requestHeader = new Headers();
    requestHeader.append('Content-Type', 'application/json');
    requestHeader.append('X-App-Key', this.config.appkey);
    return fetch(this.config.nameServerUrl + "/app/" + this.config.className + "/userid/" + userJid + "/", {
      method: 'PUT',
      headers: requestHeader,
      body: JSON.stringify({
          "query" : {
            "userid" : userJid
          },
          "object" : {
            "username" : name,
          }
        }),
      })
      .then(this._checkStatus)
      .then(this._parseJSON)
  }
}
