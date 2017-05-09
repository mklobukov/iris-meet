import React from 'react'
import PropTypes from 'prop-types'
import './meet-toolbar.css'

const MeetToolbarComponent = ({ screenShareControl, isHidden, _onMicrophoneMute, microphoneMuted, _onCameraMute, cameraMuted, _onExpandHide, barHidden, _onHangup }) => (
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
      <a className="button"><i className="fa fa-comments" aria-hidden="true"></i></a>
      <a className="button" onClick={screenShareControl.bind(this)}><i className="fa fa-desktop" aria-hidden="true"></i></a>
      <a className="button" onClick={_onExpandHide.bind(this)}><i className={barHidden ? "fa fa-expand" : "fa fa-compress"} aria-hidden="true"></i></a>
      <a className="button"><i className="fa fa-cogs" aria-hidden="true"></i></a>
      <a className="button" onClick={_onHangup.bind(this)}><i className="fa fa-phone text-danger" aria-hidden="true"></i></a>
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
  _onHangup: PropTypes.func.isRequired
}


export default MeetToolbarComponent
