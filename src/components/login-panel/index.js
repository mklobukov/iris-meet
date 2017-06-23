import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import './login-panel.css'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const validResolutions = ['auto', '1080', 'fullhd', '720', 'hd', '960', '360', '640', 'vga', '180', '320'];

const stylePaper = {
  height: 200,
  width: 'auto',
  margin: 0,
  display: 'flex',
  alignItems: 'center'
};

const enterRoomPaper = {
  height: 200,
  width: 'auto',
  margin: 0,
  paddingLeft: 20,
  display: 'flex',
  alignItems: 'center'
};

const dialerPaper = {
  height: 200,
  width: 300,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const styleButton = {
  margin: 12,
};

const labelStyle = {
  color: "rgb(0, 188, 212)"
}

const dropDownStyle = {
  border: 'none'
}

const LoginPanelComponent = ({showUser, userNameText, _onUserNameTextChange, showRoom, roomNameText, _onRoomNameTextChange, onAction, displayDialer, _onResolutionChoice, resolutionChoice}) => (
  <div id="main-login">
    <Paper style={stylePaper} zDepth={1} rounded={false}>
      <Paper style={enterRoomPaper} zDepth={1} rounded={false}>
        <form onsubmit={onAction}>
          <div id="login-panel" className="form">
            {showUser === true ? <div className="form-group">
              <TextField
                type="text"
                autoComplete="off"
                className="form-control"
                id="userName"
                hintText="Name"
                value={userNameText}
                onChange={_onUserNameTextChange}
              />
            </div> : null}
            <div id="inputs">
              {showRoom === true ? <div className="form-group">
                <TextField
                  type="text"
                  className="form-control"
                  id="roomName"
                  hintText="Enter room name"
                  value={roomNameText}
                  onChange={_onRoomNameTextChange.bind(this)}
                />
              </div> : null}


              <DropDownMenu value={resolutionChoice} onChange={_onResolutionChoice}
                            openImmediately={false} underlineStyle={dropDownStyle} labelStyle={labelStyle}>
                {validResolutions.map((resolution) => {
                  return <MenuItem value={resolution} label={"Resolution: " + resolution} primaryText={resolution} key={resolution}/>
                }
              )}
              </DropDownMenu>
            </div>

            <RaisedButton
              label="Enter"
              primary={true}
              style={styleButton}
              type="submit"
              onClick={onAction}
            />
        </div>
      </form>

      </Paper>

      <Paper style={dialerPaper} zDepth={1} rounded={false}>
          <RaisedButton
            label="Open Dialer"
            primary={true}
            style={styleButton}
            type="submit"
            onClick={displayDialer}
          />
      </Paper>
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
  onAction: PropTypes.func.isRequired,
  _onResolutionChoice: PropTypes.func.isRequired
}

export default LoginPanelComponent
