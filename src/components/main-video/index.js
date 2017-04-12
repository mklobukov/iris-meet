import React from 'react'
import PropTypes from 'prop-types'
import './main-video.css'

const MainVideo = (props) => (
  <div className="main-video">
    {props.children}
  </div>
);

MainVideo.propTypes = {
  children: PropTypes.array.isRequired
}

export default MainVideo
