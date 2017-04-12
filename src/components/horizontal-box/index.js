import React from 'react'
import PropTypes from 'prop-types'
import './horizontal-box.css'

const HorizontalBoxComponent = (props) => (
    <div className="horizontal-box" onClick={props.onClick}>
      {props.children}
    </div>
  );

HorizontalBoxComponent.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired
}

export default HorizontalBoxComponent
