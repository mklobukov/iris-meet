import React from 'react'
import PropTypes from 'prop-types'
import './horizontal-wrapper.css'
import './main-footer.css'

const HorizontalWrapper = (props) => (
  <div id="footer">
    <div className={props.isHidden ? "horizontal-wrapper videoBarHide" : "horizontal-wrapper videoBarShow"}>
        {props.children}
    </div>
  </div>
);

HorizontalWrapper.PropTypes = {
  isHidden: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
}

export default HorizontalWrapper
