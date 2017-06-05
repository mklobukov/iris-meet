import React from 'react';
import { changeMainView } from '../actions/video-control-actions';
import HorizontalBoxComponent from '../components/horizontal-box';
import { connect } from 'react-redux'

let clickHandlerCreator = function(dispatch) {
  let clickHandler = function(type, id, domId, triggeredOnClick, localVideos, remoteVideos) {
    dispatch(changeMainView(type, id, domId, triggeredOnClick, localVideos, remoteVideos))
  };

  return clickHandler
}

class HorizontalBox extends React.Component {
  constructor(props) {
  super(props);
  this.clickHandler = clickHandlerCreator(this.props.dispatch);
  }

  render() {
    return (
      <HorizontalBoxComponent onClick={() =>this.clickHandler(this.props.type, this.props.id, this.props.domId, true, this.props.localVideos, this.props.remoteVideos)}>
      {this.props.children}
      </HorizontalBoxComponent>
    )
  }
}

export default connect()(HorizontalBox);
