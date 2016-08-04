import BaseStore from './base-store';
import UserStoreConstants from '../constants/user-store-constants';

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

    console.log(this.userInfo);
  }
}

export default new UserStore();
