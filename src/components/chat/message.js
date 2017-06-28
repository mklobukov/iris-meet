import React from 'react';

class Message extends React.Component {

  _adjustForEST(date) {
    const offset = -8.0
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const mydate = new Date(utc + (3600000*offset));
    const hhmm = mydate.toISOString().substr(11,5);
    return hhmm;
  }

  render() {
    const hhmm = this._adjustForEST(this.props.timestamp);
    return (
      <div className="chat-message">
        <b className="chat-message-sender"> {this.props.sender} </b>
        <span className="chat-message-time">{hhmm}</span>
        <br />
        <span className="chat-message-text"> {this.props.text}</span>
      </div>
    );
  }
}

export default Message;
