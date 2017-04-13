import React from 'react'
import PropTypes from 'prop-types'
import './horizontal-wrapper.css'

const HorizontalWrapper = ({isHidden, children}) => (
  <div id="footer">
    <div className={isHidden ? "horizontal-wrapper videoBarHide" : "horizontal-wrapper videoBarShow"}>
        {children}
    </div>
  </div>
);

HorizontalWrapper.PropTypes = {
  isHidden: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
}

export default HorizontalWrapper
