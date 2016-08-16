import AppDispatcher from '../dispatcher/app-dispatcher';
import MessageConstants from '../constants/message-constants';

class MessageActions {
  roomReady(userName, roomName, routingId, rootNodeId, rootChildNodeId) {
    AppDispatcher.dispatch({
      actionType: MessageConstants.GET_ROOM,
      data: {
        userName,
        roomName,
        routingId,
        rootNodeId,
        rootChildNodeId,
      }
    })
  }

  sendMessage(userName, routingId, roomName, messageText) {
    AppDispatcher.dispatch({
      actionType: MessageConstants.MESSAGE_SEND,
      data: {
        userName,
        routingId,
        roomName,
        messageText,
      }
    });
  }

  receiveMessages() {
    AppDispatcher.dispatch({
      actionType: MessageConstants.RECEIVE_MESSAGES,
    });
  }
}

export default new MessageActions();
