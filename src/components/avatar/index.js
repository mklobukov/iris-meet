import React from 'react'
import PropTypes from 'prop-types'
import './avatar.css'

const Avatar = ({data, userName, onClick}) => (
  <div className="testdiv" onClick={onClick}>
    <img className="testim" src={"data:image/svg+xml;base64, " + data} alt={"user icon"} />
  </div>
);

Avatar.propTypes = {
  data: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Avatar
