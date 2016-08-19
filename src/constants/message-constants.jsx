import KeyMirror from 'keymirror';

const MessageConstants = {
  GET_ROOM:null,
  ROOM_READY_EVENT: null,
  MESSAGE_SEND: null,
  MESSAGE_SENT_EVENT: null,
  RECEIVE_MESSAGES: null,
  MESSAGES_RECEIVED_EVENT: null,
  NEW_MESSAGE_ARRIVED_EVENT: null,
  RESET_MESSAGE_COUNT: null,
}

export default KeyMirror(MessageConstants);
