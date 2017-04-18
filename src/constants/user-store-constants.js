import KeyMirror from 'keymirror';

const UserStoreConstants = {
  USER_LOGIN: null,
  USER_LOGGED_IN_EVENT: null,
  USER_LOGIN_FAILED_EVENT: null,
  USER_LEAVE_ROOM: null,
  USER_LEFT_ROOM_EVENT: null,
}

export default KeyMirror(UserStoreConstants);
