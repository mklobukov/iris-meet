import BaseStore from './base-store';
import UserStoreConstants from '../constants/user-store-constants';
import { AuthManager } from 'iris-auth-js-sdk';

class UserStore extends BaseStore {
  constructor() {
    super();
    this.registerActions(() => this._actionsHandler.bind(this));

    this.userInfo = {
      userName: null,
      roomName: null,
      accessToken: null,
    }
  }

  addUserListener(name, callback) {
    this.addListener(name, callback);
  }

  removeUserListener(name, callback) {
    this.removeListener(name, callback);
  }

  _actionsHandler(action) {
    switch (action.actionType) {
      case UserStoreConstants.USER_LOGIN:
        if (action.data && action.data.userName && action.data.roomName) {
          this._handleUserLogin(action.data.userName, action.data.roomName);
        }
    }
  }

  _handleUserLogin(userName, roomName) {
    this.userInfo.userName = userName;
    this.userInfo.roomName = roomName;
    let authApi = new AuthManager({"managementApiUrl": "https://iris.xrtc.me/", "appKey": "bJjeXEpiqXMBAJpuDr0ksg7pkUCQlNlV"});
    authApi.anonymousLogin(this.userName, this._onLoginSuccess.bind(this), this._onLoginFailure.bind(this));
  }

  _onLoginSuccess(data) {
    this.userInfo.accessToken = data.Token;
    console.log(this.userInfo);
    this.emit(UserStoreConstants.USER_LOGGED_IN_EVENT);
  }

  _onLoginFailure(error) {
    this.emit(UserStoreConstants.USER_LOGIN_FAILED_EVENT, error);
  }
}

export default new UserStore();
