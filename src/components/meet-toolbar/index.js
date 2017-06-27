import React from 'react'
import PropTypes from 'prop-types'
import './meet-toolbar.css'

const MeetToolbarComponent = ({ screenShareControl, isHidden, _onMicrophoneMute, microphoneMuted, _onCameraMute, cameraMuted, _onExpandHide, barHidden, _onHangup, _isExtInstalled, extInstalled, _showInDev, domSpeakerSwitchEnabled, _enableDom, showChat, hasUnreadMessages }) => (
  <div id="header">
    <span id="toolbar" className={isHidden ? "toolbarHide" : "toolbarShow"}>
      <a className="button" onClick={_onMicrophoneMute.bind(this)}>{microphoneMuted ?
        <span className="fa-stack">
          <i className="fa fa-microphone fa-stack-1x" aria-hidden="true"></i>
          <i className="fa fa-ban fa-stack-2x text-danger" aria-hidden="true"></i>
        </span>
        : <i className="fa fa-microphone" aria-hidden="true"></i>}</a>
      <a className="button" onClick={_onCameraMute.bind(this)}>{cameraMuted ?
        <span className="fa-stack">
          <i className="fa fa-camera fa-stack-1x" aria-hidden="true"></i>
          <i className="fa fa-ban fa-stack-2x text-danger" aria-hidden="true"></i>
        </span>
        : <i className="fa fa-camera" aria-hidden="true"></i>}</a>
      <a className="button" onClick={showChat} style={hasUnreadMessages ? {color: "red"} : null}><i className="fa fa-comments" aria-hidden="true"></i></a>


      { extInstalled ?
      <a className="button" onClick={() => {screenShareControl(false)} }>
        <i className="fa fa-desktop" aria-hidden="true" id="screenShare"></i></a>
      :
      <a className="button" onClick={() => {window.chrome.webstore.install(undefined, function(success) {console.log("INSTALLED!"); setTimeout(function() { screenShareControl(true); }, 2000); }, function(fail) {console.log("Could not install the extension.", fail)} )} }>
        <i className="fa fa-desktop" aria-hidden="true" id="install-button"></i></a>
      }

      <a className="button" onClick={() => {_onExpandHide();}}><i className={!barHidden ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i></a>
      <a className="button" onClick={_showInDev.bind(this)}><i className="fa fa-cogs" aria-hidden="true"></i></a>
      <a className="button" onClick={_onHangup.bind(this)}><i className="fa fa-phone text-danger" aria-hidden="true"></i></a>
      <a className="button" onClick={_enableDom.bind(this)} style={domSpeakerSwitchEnabled ? {display: 'none' } : null }><i className="fa fa-exchange"></i></a>

    </span>
  </div>
)


MeetToolbarComponent.propTypes = {
  screenShareControl: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  _onMicrophoneMute: PropTypes.func.isRequired,
  microphoneMuted: PropTypes.bool.isRequired,
  _onCameraMute: PropTypes.func.isRequired,
  cameraMuted: PropTypes.bool.isRequired,
  _onExpandHide: PropTypes.func.isRequired,
  barHidden: PropTypes.bool.isRequired,
  _onHangup: PropTypes.func.isRequired,
  _isExtInstalled: PropTypes.func.isRequired,
  extInstalled: PropTypes.bool.isRequired,
  _showInDev: PropTypes.func.isRequired,
  domSpeakerSwitchEnabled: PropTypes.bool.isRequired,
  _enableDom: PropTypes.func.isRequired,
  showChat: PropTypes.func.isRequired,
  hasUnreadMessages: PropTypes.bool.isRequired
}

export default MeetToolbarComponent
