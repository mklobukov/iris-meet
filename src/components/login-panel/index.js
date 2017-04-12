import React from 'react';
import './login-panel.css'

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
