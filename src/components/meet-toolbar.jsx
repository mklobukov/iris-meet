import React from 'react';

export default class MeetToolbar extends React.Component {
    constructor(props) {
        super(props)
    }

    _onMicrophoneMute() {
      console.log('Microphone muted');
    }

    _onCameraMute() {
      console.log('Camera muted');
    }

    _onHangup() {
      const hostname = window.location.href;
      const urlString = hostname.substring(0, hostname.lastIndexOf("/"));
      console.log('Hangup: ' + urlString);
      window.location.assign(urlString);
    }

    render() {
        return (
            <div id="header">
                <span id="toolbar">
                  <a className="button" onClick={this._onMicrophoneMute.bind(this)}><i className="fa fa-microphone" aria-hidden="true"></i></a>
                  <a className="button" onClick={this._onCameraMute.bind(this)}><i className="fa fa-camera" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-comments" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-desktop" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-expand" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-cogs" aria-hidden="true"></i></a>
                  <a className="button" onClick={this._onHangup.bind(this)}><i className="fa fa-phone text-danger" aria-hidden="true"></i></a>
                </span>
            </div>
        );
    }
}
