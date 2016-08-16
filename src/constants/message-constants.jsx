import KeyMirror from 'keymirror';

const MessageConstants = {
  GET_ROOM:null,
  ROOM_READY_EVENT: null,
  MESSAGE_SEND: null,
  MESSAGE_SENT_EVENT: null,
  RECEIVE_MESSAGES: null,
  MESSAGES_RECEIVED_EVENT: null,
}

export default KeyMirror(MessageConstants);
