import React from 'react';
import VideoControlActions from '../actions/video-control-actions';
import HorizontalBoxComponent from '../components/horizontal-box';

class HorizontalBox extends React.Component {
  _handleVideoSelection() {
    VideoControlActions.changeMainView(this.props.type, this.props.id);
  }

  render() {
    return (
      <HorizontalBoxComponent onClick={this._handleVideoSelection.bind(this)}>
      {this.props.children}
      </HorizontalBoxComponent>
    );
  }
}

export default HorizontalBox;
