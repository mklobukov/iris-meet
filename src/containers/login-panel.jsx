import React from 'react';
import LoginPanelComponent from '../components/login-panel'

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userNameText: '',
      roomNameText: '',
    }
  }

  _onRoomNameTextChange(e) {
    this.setState({
      roomNameText: e.target.value,
    });
  }

  _onUserNameTextChange(e) {
    this.setState({
      userNameText: e.target.value,
    });
  }

  get userName() {
    return this.state.userNameText;
  }

  get roomName() {
    return this.state.roomNameText;
  }

  render () {
    return(
      <LoginPanelComponent
          showUser={this.props.showUser}
          userNameText={this.state.userNameText}
          _onUserNameTextChange={this._onUserNameTextChange.bind(this)}
          showRoom={this.props.showRoom}
          roomNameText={this.state.roomNameText}
          _onRoomNameTextChange={this._onRoomNameTextChange.bind(this)}
          onAction={this.props.onAction}
      />
    );
  }
}
