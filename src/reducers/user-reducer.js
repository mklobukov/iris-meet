import UserStoreConstants from '../constants/user-constants';
import { AuthManager } from 'iris-auth-js-sdk';
import Config from '../../config.json';

/*
Format of this reducer's part of state tree:
{
  userName,
  routingId,
  roomName,
  accessToken,
  decodedToken
}
*/

const UserReducer = (state = {}, action) => {
  console.log('ACTIONS!');
  console.log(action);
  switch(action.type) {
      case UserStoreConstants.USER_LOGIN:
        if (action.data && action.data.userName &&
            action.data.routingId && action.data.roomName &&
            action.data.accessToken && action.data.decodedToken) {
              console.log('action.data: ' +action.data)
            return {
              userName: action.data.userName,
              routingId: action.data.routingId,
              roomName: action.data.roomName,
              accessToken: action.data.accessToken,
              decodedToken: action.data.decodedToken
            }
        }
        else {
          return state
        }

      case UserStoreConstants.USER_LEAVE_ROOM:
        return {
          userName: null,
          routingId: null,
          roomName: null,
          accessToken: null,
          decodedToken: null
      }

      default:
        return state
  }
}

export default UserReducer
