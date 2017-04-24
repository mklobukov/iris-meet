import React from 'react'
import PropTypes from 'prop-types'
import './black-box.css'

const BlackBox = ({userName}) => (
  <div className="black-box">
    <div className="user-text">
      <div>Current Speaker:</div>
      <p>{userName}</p>
    </div>
  </div>
);

BlackBox.propTypes = {
  userName: PropTypes.string.isRequired
}

export default BlackBox
