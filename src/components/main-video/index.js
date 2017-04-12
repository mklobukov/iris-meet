import React from 'react';
import './main-video.css'


function MainVideo(props) {
  return (
    <div className="main-video">
      {props.children}
    </div>
  )
}

export default MainVideo
