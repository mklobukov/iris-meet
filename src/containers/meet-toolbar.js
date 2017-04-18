import React from 'react';
import MeetToolbarComponent from '../components/meet-toolbar';

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
      this.props.onHangup();
    }

    _onExpandHide() {
      this.setState({
        barHidden: !this.state.barHidden,
      }, () => {
        this.props.onExpandHide();
      });
    }

    render () {
      return (
        <MeetToolbarComponent
          isHidden={this.props.isHidden}
          _onMicrophoneMute={this._onMicrophoneMute.bind(this)}
          microphoneMuted={this.state.microphoneMuted}
          _onCameraMute={this._onCameraMute.bind(this)}
          cameraMuted={this.state.cameraMuted}
          _onExpandHide={this._onExpandHide.bind(this)}
          barHidden={this.state.barHidden}
          _onHangup={this._onHangup.bind(this)}
        />
      )
    }
  }
