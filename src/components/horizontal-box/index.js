import React from 'react'
import PropTypes from 'prop-types'
import './horizontal-box.css'

const HorizontalBoxComponent = ({children, onClick}) => (
    <div className="horizontal-box" onClick={onClick}>
      {children}
    </div>
  );

HorizontalBoxComponent.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired
}

export default HorizontalBoxComponent
