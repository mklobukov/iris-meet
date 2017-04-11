import React from 'react';

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

  render() {
    return (
      <div id="login-panel">
        <form className="form">
          {this.props.showUser === true ? <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="userName"
              placeholder="User name"
              value={this.state.userNameText}
              onChange={this._onUserNameTextChange.bind(this)}
            />
          </div> : null}
          {this.props.showRoom === true ? <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="roomName"
              placeholder="Room name"
              value={this.state.roomNameText}
              onChange={this._onRoomNameTextChange.bind(this)}
            />
          </div> : null}
          <button
            type="submit"
            className="btn btn-default"
            onClick={this.props.onAction}
          >Accept</button>
        </form>
      </div>
    );
  }
}
