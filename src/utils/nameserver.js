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

  // _parseJSON(response) {
  //   return response.json();
  // }
  _parseJSON(response) {
    return response.text().then(function(text) {
      console.log("TEXT test: ", text)
      console.log(text == {})
      return text ? JSON.parse(text) : {}
    })
  }


  getAllUsers() {
    console.log("INSIDE GET ALL USERS")
    const requestHeader = new Headers();
    requestHeader.append('Content-Type', 'application/json');
    requestHeader.append("Access-Control-Allow-Origin", "*")
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

  getUserByJid(userJid, roomname) {
    console.log("Inside get user by jid. Replacing / with _ in the jid")
    const requestHeader = new Headers();
    requestHeader.append('Content-Type', 'application/json');
    //remove slash from the jid and replace it with underscore. Request won't work with
    //an extra forward slash in the url
    let jid = userJid.replace(/\//g, '_')
    console.log(jid)
    return fetch(this.config.nameServerUrl + "/app/" + roomname + "/userid/" + jid, {
      method: 'GET',
      headers: requestHeader,
    })
    .then(this._checkStatus)
    .then(this._parseJSON)
  }
  // getUserByJid(userJid, roomname) {
  //   console.log("Inside get user by jid")
  //   const requestHeader = new Headers();
  //   requestHeader.append('Content-Type', 'application/json');
  //   //remove slash from the jid and replace it with underscore. Request won't work with
  //   //an extra forward slash in the url
  //   const jid = userJid.replace(/\//g, '_')
  //   return fetch(this.config.nameServerUrl + "/app/" + "room10" + "/userid/" + "bernieId" + "/", {
  //     method: 'GET',
  //     headers: requestHeader,
  //   })
  //   .then(this._checkStatus)
  //   .then(this._parseJSON)
  // }

  addOrUpdateUser(userJid, roomname, name) {
    console.log("add or update user")
    const requestHeader = new Headers();
    requestHeader.append('Content-Type', 'application/json');
    //remove slash from the jid and replace it with underscore. Request won't work with
    //an extra forward slash in the url
    const jid = userJid.replace(/\//g, '_')
    return fetch(this.config.nameServerUrl + "/app/" + roomname + "/userid/" + jid + "/", {
      method: 'PUT',
      headers: requestHeader,
      body: JSON.stringify({
          "query" : {
            "userJid" : jid,
          },
          "object" : {
            "username" : name,
            "roomname" : roomname,
            "userJid" : jid,
          }
        }),
      })
      .then(this._checkStatus)
      .then(this._parseJSON)
  }
}
