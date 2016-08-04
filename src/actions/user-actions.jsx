import AppDispatcher from '../dispatcher/app-dispatcher';
import UserStoreConstants from '../constants/user-store-constants';

class UserActions {
  loginUser(userName, roomName) {
    AppDispatcher.dispatch({
      actionType: UserStoreConstants.USER_LOGIN,
      data: {
        userName,
        roomName,
      }
    });
  }
}

export default new UserActions();
