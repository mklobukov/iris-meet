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

  leaveRoom() {
    AppDispatcher.dispatch({
      actionType: UserStoreConstants.USER_LEAVE_ROOM,
    });
  }
}

export default new UserActions();
