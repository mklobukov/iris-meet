import React from 'react';

export default class MeetToolbar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          microphoneMuted: false,
          cameraMuted: false,
          barHidden: false,
        }
    }

    _onMicrophoneMute() {
      this.setState({
        microphoneMuted: !this.state.microphoneMuted,
      }, () => {
        this.props.onMicrophoneMute(this.state.microphoneMuted);
      });
    }

    _onCameraMute() {
      this.setState({
        cameraMuted: !this.state.cameraMuted,
      }, () => {
        this.props.onCameraMute(this.state.cameraMuted);
      });
    }

    _onHangup() {
      const hostname = window.location.href;
      const urlString = hostname.substring(0, hostname.lastIndexOf("/"));
      window.location.assign(urlString);
    }

    _onExpandHide() {
      this.setState({
        barHidden: !this.state.barHidden,
      }, () => {
        this.props.onExpandHide();
      });
    }

    render() {
        return (
            <div id="header">
                <span id="toolbar">
                  <a className="button" onClick={this._onMicrophoneMute.bind(this)}>{this.state.microphoneMuted ?
                    <span className="fa-stack">
                      <i className="fa fa-microphone fa-stack-1x" aria-hidden="true"></i>
                      <i className="fa fa-ban fa-stack-2x text-danger" aria-hidden="true"></i>
                    </span>
                    : <i className="fa fa-microphone" aria-hidden="true"></i>}</a>
                  <a className="button" onClick={this._onCameraMute.bind(this)}>{this.state.cameraMuted ?
                    <span className="fa-stack">
                      <i className="fa fa-camera fa-stack-1x" aria-hidden="true"></i>
                      <i className="fa fa-ban fa-stack-2x text-danger" aria-hidden="true"></i>
                    </span>
                    : <i className="fa fa-camera" aria-hidden="true"></i>}</a>
                  <a className="button"><i className="fa fa-comments" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-desktop" aria-hidden="true"></i></a>
                  <a className="button" onClick={this._onExpandHide.bind(this)}><i className={this.state.barHidden ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-cogs" aria-hidden="true"></i></a>
                  <a className="button" onClick={this._onHangup.bind(this)}><i className="fa fa-phone text-danger" aria-hidden="true"></i></a>
                </span>
            </div>
        );
    }
}
