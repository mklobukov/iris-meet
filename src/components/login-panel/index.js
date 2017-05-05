import React from 'react'
import PropTypes from 'prop-types'
import './login-panel.css'
import {
  Button
} from 'react-bootstrap';

const LoginPanelComponent = ({showUser, userNameText, _onUserNameTextChange, showRoom, roomNameText, _onRoomNameTextChange, onAction}) => (
  <div id="login-panel">
    <form className="form">
      {showUser === true ? <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="userName"
          placeholder="User name"
          value={userNameText}
          onChange={_onUserNameTextChange}
        />
      </div> : null}
      {showRoom === true ? <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="roomName"
          placeholder="Room name"
          value={roomNameText}
          onChange={_onRoomNameTextChange.bind(this)}
        />
      </div> : null}
      <Button
        type="submit"
        onClick={onAction}
      >Accept</Button>
    </form>
  </div>
);

LoginPanelComponent.propTypes = {
  showUser: PropTypes.bool.isRequired,
  userNameText: PropTypes.string.isRequired,
  _onUserNameTextChange: PropTypes.func.isRequired,
  showRoom: PropTypes.bool.isRequired,
  roomNameText: PropTypes.string.isRequired,
  _onRoomNameTextChange: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired
}

export default LoginPanelComponent
