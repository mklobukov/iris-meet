import UserConstants from '../constants/user-constants';
import { AuthManager } from 'iris-auth-js-sdk';

export const storeLoginData = (userName, routingId, roomName, accessToken, decodedToken) => ({
    type: UserConstants.USER_LOGIN,
    data: {
      userName,
      routingId,
      roomName,
      accessToken,
      decodedToken
    }
})

export function loginUserAsync (userName, routingId, roomName, authUrl, appKey) {
  return function(dispatch) {
    let authApi = new AuthManager({'managementApiUrl': authUrl, 'appkey': appKey});
    return authApi.anonymousLoginAsync(userName).then(
      data => {
          dispatch(storeLoginData(userName, routingId, roomName,
                    data.Token, authApi.decodeToken(data.Token)))}
      )
      .catch(
        error => { console.log('ERROR LOGGING IN ' + error);
        dispatch(storeLoginData(userName, routingId, roomName, null, null)) }
      );
    };
}

export const leaveRoom = () => ({
      type: UserConstants.USER_LEAVE_ROOM
})
