
import React from 'react'
import PropTypes from 'prop-types'
import './black-box.css'

const BlackBox = ({userName, onClick}) => (
  <div className="black-box" onClick={onClick}>
    <div className="user-text">
      <div>Current Speaker:</div>
      <p>{userName}</p>
    </div>
  </div>
);

BlackBox.propTypes = {
  userName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default BlackBox
