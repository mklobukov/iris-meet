import React from 'react';

function LoginPanelComponent (props) {
  return (
    <div id="login-panel">
      <form className="form">
        {props.showUser === true ? <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="userName"
            placeholder="User name"
            value={props.userNameText}
            onChange={props._onUserNameTextChange}
          />
        </div> : null}
        {props.showRoom === true ? <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="roomName"
            placeholder="Room name"
            value={props.roomNameText}
            onChange={props._onRoomNameTextChange.bind(this)}
          />
        </div> : null}
        <button
          type="submit"
          className="btn btn-default"
          onClick={props.onAction}
        >Accept</button>
      </form>
    </div>
  );

}

export default LoginPanelComponent
/*
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

  */
