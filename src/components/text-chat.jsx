'use strict';

import React, { Component } from 'react';

export default class TextChat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.isHidden ? "chat-panel chat-panel-hide" : "chat-panel chat-panel-show"}>
        <div id="text-chat-heading" className="panel panel-primary">

          <div className="panel-body">
              <ul className="chat">
                  <li className="left clearfix"><span className="chat-img pull-left">
                      <img src="assets/u-avatar.png" alt="User Avatar" className="img-circle" />
                  </span>
                      <div className="chat-body clearfix">
                          <div className="header">
                              <strong className="primary-font">Jack Sparrow</strong> <small className="pull-right text-muted">
                                  <span className="glyphicon glyphicon-time"></span>12 mins ago</small>
                          </div>
                          <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                              dolor, quis ullamcorper ligula sodales.
                          </p>
                      </div>
                  </li>
                  <li className="right clearfix"><span className="chat-img pull-right">
                      <img src="assets/me-avatar.png" alt="User Avatar" className="img-circle" />
                  </span>
                      <div className="chat-body clearfix">
                          <div className="header">
                              <small className=" text-muted"><span className="glyphicon glyphicon-time"></span>13 mins ago</small>
                              <strong className="pull-right primary-font">Bhaumik Patel</strong>
                          </div>
                          <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                              dolor, quis ullamcorper ligula sodales.
                          </p>
                      </div>
                  </li>
                  <li className="left clearfix"><span className="chat-img pull-left">
                      <img src="assets/u-avatar.png" alt="User Avatar" className="img-circle" />
                  </span>
                      <div className="chat-body clearfix">
                          <div className="header">
                              <strong className="primary-font">Jack Sparrow</strong> <small className="pull-right text-muted">
                                  <span className="glyphicon glyphicon-time"></span>14 mins ago</small>
                          </div>
                          <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                              dolor, quis ullamcorper ligula sodales.
                          </p>
                      </div>
                  </li>
                  <li className="right clearfix"><span className="chat-img pull-right">
                      <img src="assets/me-avatar.png" alt="User Avatar" className="img-circle" />
                  </span>
                      <div className="chat-body clearfix">
                          <div className="header">
                              <small className=" text-muted"><span className="glyphicon glyphicon-time"></span>15 mins ago</small>
                              <strong className="pull-right primary-font">Bhaumik Patel</strong>
                          </div>
                          <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                              dolor, quis ullamcorper ligula sodales.
                          </p>
                      </div>
                  </li>
              </ul>
          </div>
          <div id="text-chat-footer" className="panel-footer">
              <div className="input-group">
                  <input id="btn-input" type="text" className="form-control input-sm" placeholder="Type your message here..." />
                  <span className="input-group-btn">
                      <button className="btn btn-default btn-sm" id="btn-chat">
                          Send</button>
                  </span>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
