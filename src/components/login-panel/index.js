import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import './login-panel.css'

const stylePaper = {
  height: 200,
  width: 400,
  margin: 20,
  display: 'flex',
  alignItems: 'center'
};

const styleButton = {
  margin: 12,
};

const LoginPanelComponent = ({showUser, userNameText, _onUserNameTextChange, showRoom, roomNameText, _onRoomNameTextChange, onAction}) => (
  <div id="main-login">
    <Paper style={stylePaper} zDepth={1} rounded={false}>
      <form id="login-panel" className="form">
        {showUser === true ? <div className="form-group">
          <TextField
            type="text"
            className="form-control"
            id="userName"
            hintText="Name"
            value={userNameText}
            onChange={_onUserNameTextChange}
          />
        </div> : null}
        {showRoom === true ? <div className="form-group">
          <TextField
            type="text"
            className="form-control"
            id="roomName"
            hintText="Room name"
            value={roomNameText}
            onChange={_onRoomNameTextChange.bind(this)}
          />
        </div> : null}
        <RaisedButton
          label="Accept"
          primary={true}
          style={styleButton}
          type="submit"
          onClick={onAction}
        />
      </form>
    </Paper>
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
