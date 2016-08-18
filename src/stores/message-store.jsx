import BaseStore from './base-store';
import MessageConstants from '../constants/message-constants';
import { AuthManager } from 'iris-auth-js-sdk';
import { EventManager } from 'iris-em-js-sdk';
import Config from '../../config.json';

const authUrl = Config.authUrl;
const appKey = Config.appKey;
const emUrl = Config.eventManagerUrl + '/';

class MessageStore extends BaseStore {
  constructor() {
    super();
    this.registerActions(() => this._actionsHandler.bind(this));

    this.messages = [];
    this.token = null;
    this.userName = null;
    this.roomName = null;
    this.routingId = null;
    this.sessionRootNodeId = null;
    this.sessionRootChildNodeId = null;
    this.pollTimer = null;
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
            action.data.token &&
            action.data.userName &&
            action.data.roomName &&
            action.data.routingId &&
            action.data.rootNodeId &&
            action.data.rootChildNodeId) {
          this._handleRoomReady(action.data.token, action.data.userName, action.data.roomName,
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

  _handleRoomReady(token, userName, roomName, routingId, rootNodeId, rootChildNodeId) {
    this.messages = [];
    this.token = token;
    this.userName = userName;
    this.roomName = roomName;
    this.routingId = routingId;
    this.sessionRootNodeId = rootNodeId;
    this.sessionRootChildNodeId = rootChildNodeId;
    this.emit(MessageConstants.ROOM_READY_EVENT);
    this._pollForMessages()
  }

  _pollForMessages() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }

    this.pollTimer = setTimeout(() => {
      this._handleReceiveMessages();
    }, 3000);
  }

  _cancelPoll() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  _handleSendMessage(userName, routingId, roomName, messageText) {
    const textMessageObject = {
      userName,
      routingId,
      roomName,
      messageText,
      timePosted: Number(new Date()),
    };

    console.log('token: ' + this.token);
    const eventMgr = new EventManager({ emApiUrl: emUrl, jwt: this.token });
    const childOptions = {
      node_id: this.sessionRootChildNodeId,
      event_type: 'textMessage',
      from: this.routingId,
      time_posted: textMessageObject.timePosted,
      root_node_id: this.sessionRootNodeId,
      userdata: JSON.stringify(textMessageObject)
    }
    console.log('stringified json: ');
    console.log(childOptions.userdata);
    eventMgr.createChildEvent(childOptions, (childData) => {
      console.log('SEND MESSAGE SEND MESSAGE SEND MESSAGE');
      console.log(childData);
      this.emit(MessageConstants.MESSAGE_SENT_EVENT);
    }, (error) => {
      console.log('Error occurred sending message:');
      console.log(error);
    });
  }

  _handleReceiveMessages() {
    this._cancelPoll();
    console.log('in _handleReceiveMessages');
    const eventMgr = new EventManager({ emApiUrl: emUrl, jwt: this.token });
    eventMgr.getChildEvents(this.sessionRootChildNodeId, 100, (childNodes) => {
      console.log(childNodes);
      this.messages = [];
      childNodes.map((childNode) => {
        console.log(childNode);
        const messageReceived = childNode.Userdata;
        console.log('before parse:');
        console.log(messageReceived);
        const messageObj = JSON.parse(messageReceived);
        this.messages.unshift(messageObj);
        return messageReceived;
      });
      this.emit(MessageConstants.MESSAGES_RECEIVED_EVENT);
      this._pollForMessages();
    }, (error) => {
      console.log('Error occurred receiving messages:');
      console.log(error);
      this._pollForMessages();
    });
  }

  get rootNodeId() {
    return this.sessionRootNodeId;
  }

  get rootChildNodeId() {
    return this.sessionRootChildNodeId;
  }

  get latestMessages() {
    return this.messages;
  }
}

export default new MessageStore();
