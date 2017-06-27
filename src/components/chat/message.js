import React from 'react';

class Message extends React.Component {
  render() {
    let now = new Date(this.props.timestamp);
    let hhmmss = now.toISOString().substr(11,8);
    return (
      <div className="chat-message">
        <span className="chat-message-time">{hhmmss}</span>
        <b className="chat-message-owner">{this.props.owner}</b>
        <span className="chat-message-text">{this.props.text}</span>
      </div>
    );
  }
}

export default Message;
