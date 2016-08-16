import BaseStore from './base-store';
import MessageConstants from '../constants/message-constants';
import { AuthManager } from 'iris-auth-js-sdk';

const authUrl = 'https://iris.xrtc.me/';
const appKey = 'bJjeXEpiqXMBAJpuDr0ksg7pkUCQlNlV';

class MessageStore extends BaseStore {
  constructor() {
    super();
    this.registerActions(() => this._actionsHandler.bind(this));

    this.messages = [];
    this.userName = null;
    this.roomName = null;
    this.routingId = null;
    this.sessionRootNodeId = null;
    this.sessionRootChildNodeId = null;
  }

  addMessageListener(name, callback) {
    this.addListener(name, callback);
  }

  removeMessageListener(name, callback) {
    this.removeListener(name, callback);
  }

  _actionsHandler(action) {
    switch (action.actionType) {
      case MessageConstants.GET_ROOM:
        if (action.data &&
            action.data.userName &&
            action.data.roomName &&
            action.data.routingId &&
            action.data.rootNodeId &&
            action.data.rootChildNodeId) {
          this._handleRoomReady(action.data.userName, action.data.roomName,
            action.data.routingId, action.data.rootNodeId, action.data.rootChildNodeId);
        } else {
          console.log('Invalid data received for action GET_ROOM');
        }
        break;

      case MessageConstants.MESSAGE_SEND:
        if (action.data &&
            action.data.userName &&
            action.data.routingId &&
            action.data.roomName &&
            action.data.messageText) {
          this._handleSendMessage(action.data.userName, action.data.routingId,
            action.data.roomName, action.data.messageText);
        } else {
          console.log('Invalid data received for action MESSAGE_SEND');
        }
        break;

      case MessageConstants.RECEIVE_MESSAGES:
        this._handleReceiveMessages();
        break;
    }
  }

  _handleRoomReady(userName, roomName, routingId, rootNodeId, rootChildNodeId) {
    this.messages = [];
    this.userName = userName;
    this.roomName = roomName;
    this.routingId = routingId;
    this.sessionRootNodeId = rootNodeId;
    this.sessionRootChildNodeId = rootChildNodeId;
    this.emit(MessageConstants.ROOM_READY_EVENT);
  }

  _handleSendMessage() {

  }

  _handleReceiveMessages() {

  }

  get rootNodeId() {
    return this.sessionRootNodeId;
  }

  get rootChildNodeId() {
    return this.sessionRootChildNodeId;
  }
}

export default new MessageStore();
