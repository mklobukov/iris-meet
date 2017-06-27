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

    _extInstalled() {
      return this.props.isExtInstalled();
    }

    render () {
      return (
        <MeetToolbarComponent
          screenShareControl={this.props.screenShareControl.bind(this)}
          isHidden={this.props.isHidden}
          _onMicrophoneMute={this._onMicrophoneMute.bind(this)}
          microphoneMuted={this.state.microphoneMuted}
          _onCameraMute={this._onCameraMute.bind(this)}
          cameraMuted={this.state.cameraMuted}
          _onExpandHide={this._onExpandHide.bind(this)}
          barHidden={this.state.barHidden}
          _onHangup={this._onHangup.bind(this)}
          _isExtInstalled={this._extInstalled.bind(this)}
          extInstalled={this.props.extInstalled}
          _showInDev={this.props.showInDev}
          domSpeakerSwitchEnabled={this.props.domSpeakerSwitchEnabled}
          _enableDom={this.props.enableDomSwitchFunc.bind(this)}
          showChat={this.props.handleDrawerToggle}
        />
      )
    }
  }
