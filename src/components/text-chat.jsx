'use strict';

import React, { Component } from 'react';
import MessageStore from '../stores/message-store';
import MessageActions from '../actions/message-actions';
import MessageConstants from '../constants/message-constants';
import UserStore from '../stores/user-store';
import moment from 'moment';

export default class TextChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredText: '',
      messages: [],
    }

    this.onNewMessages = this._onNewMessages.bind(this);
    this.onMessageSend = this._onMessageSend.bind(this);
  }

  componentDidMount() {
    MessageStore.addMessageListener(MessageConstants.MESSAGES_RECEIVED_EVENT, this.onNewMessages);
    MessageStore.addMessageListener(MessageConstants.MESSAGE_SENT_EVENT, this.onMessageSend);
  }

  componentWillUnmount() {
    MessageStore.removeMessageListener(MessageConstants.MESSAGES_RECEIVED_EVENT, this.onNewMessages);
    MessageStore.removeMessageListener(MessageConstants.MESSAGE_SENT_EVENT, this.onMessageSend);
  }

  _onMessageSend() {
    MessageActions.receiveMessages();
  }

  _onNewMessages() {
    this.setState({
      messages: MessageStore.latestMessages,
    }, () => {
      console.log('scrolling..................');
      let element = document.getElementById("message-scroll");
      console.log(element);
      element.scrollTop = element.scrollHeight;
      console.log(element);
    });
  }

  _onSendMessage(e) {
    e.preventDefault();
    if (this.state.enteredText !== '') {
      MessageActions.sendMessage(UserStore.user, UserStore.userRoutingId, UserStore.room, this.state.enteredText);
      this.setState({
        enteredText: '',
      });
    }
  }

  _onEnterMessage(e) {
    this.setState({
      enteredText: e.target.value,
    });
  }

  render() {
    return (
      <div className={this.props.isHidden ? "chat-panel chat-panel-hide" : "chat-panel chat-panel-show"}>
        <div id="text-chat-heading" className="panel panel-primary">

          <div id="message-scroll" className="panel-body">
              <ol className="chat">
                  {this.state.messages.map((message) => {
                    const isItMe = message.userName === UserStore.user && message.routingId === UserStore.userRoutingId;
                    return (
                      <li className={isItMe ? "right clearfix" : "left clearfix"}><span className={isItMe ? "chat-img pull-right" : "chat-img pull-left"}>
                          <img src={isItMe ? "assets/me-avatar.png" : "assets/u-avatar.png"} alt="User Avatar" className="img-circle" />
                      </span>
                          <div className="chat-body clearfix">
                              {isItMe ? <div className="header">
                                  <small className=" text-muted"><span className="glyphicon glyphicon-time"></span>{moment(message.timePosted).fromNow()}</small>
                                  <strong className="pull-right primary-font">{message.userName}</strong>
                              </div> : <div className="header">
                                  <strong className="primary-font">{message.userName}</strong> <small className="pull-right text-muted">
                                      <span className="glyphicon glyphicon-time"></span>{moment(message.timePosted).fromNow()}</small>
                              </div>}
                              <p>
                                  {message.messageText}
                              </p>
                          </div>
                      </li>
                    );
                  })}
              </ol>
          </div>
          <div id="text-chat-footer" className="panel-footer">
              <form className="form">
                <div className="input-group">
                  <input
                    id="btn-input"
                    type="text"
                    className="form-control input-sm"
                    placeholder="Type your message here..."
                    value={this.state.enteredText}
                    onChange={this._onEnterMessage.bind(this)}
                  />
                  <span className="input-group-btn">
                      <button type="submit" onClick={this._onSendMessage.bind(this)} className="btn btn-default btn-sm" id="btn-chat">
                          Send</button>
                  </span>
                </div>
              </form>
          </div>
        </div>
      </div>
    );
  }
}
