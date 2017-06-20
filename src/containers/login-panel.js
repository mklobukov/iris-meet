import React from 'react';
import Dialog from 'material-ui/Dialog';
import LoginPanelComponent from '../components/login-panel'
import CircularProgress from 'material-ui/CircularProgress';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userNameText: '',
      roomNameText: '',
      resolution: 'auto',
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

  _handleResolutionChoice = (event, index, value) => {
    this.setState({resolution: value})
    this.props.onResolutionChoice(value)
  }


  get userName() {
    return this.state.userNameText;
  }

  get roomName() {
    return this.state.roomNameText;
  }

  get resolution() {
    return this.state.resolution;
  }

  render () {
    console.log("In login panel. Render Dialog? ---", this.props.isCreatingRoom)
    return(
      <div>
        <LoginPanelComponent
            showUser={this.props.showUser}
            userNameText={this.state.userNameText}
            _onUserNameTextChange={this._onUserNameTextChange.bind(this)}
            showRoom={this.props.showRoom}
            roomNameText={this.state.roomNameText}
            _onRoomNameTextChange={this._onRoomNameTextChange.bind(this)}
            onAction={this.props.onAction}
            displayDialer={this.props.displayDialer}
            _onResolutionChoice={this._handleResolutionChoice}
            resolutionChoice={this.state.resolution}
        />
    </div>
    );
  }
}
