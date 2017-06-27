import React from 'react';

class Message extends React.Component {
  render() {
    let now = new Date(this.props.timestamp);
    let hhmmss = now.toISOString().substr(11,5);
    return (
      <div className="chat-message">
        <b className="chat-message-sender"> {this.props.sender} </b>
        <span className="chat-message-time">{hhmmss}</span>
        <br />
        <span className="chat-message-text"> {this.props.text}</span>
      </div>
    );
  }
}

export default Message;
