import React from 'react';
import VideoControlActions from '../actions/video-control-actions';

export default class HorizontalBox extends React.Component {
  constructor(props) {
    super(props)
  }

/*
<video autoPlay="1" src="assets/movie.mp4"></video>
*/

  _handleVideoSelection() {
    VideoControlActions.changeMainView(this.props.type, this.props.id);
  }

  render() {
    return (
      <div className="horizontal-box" onClick={this._handleVideoSelection.bind(this)}>
        {this.props.children}
      </div>
    );
  }
}
