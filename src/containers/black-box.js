import React from 'react';
import { changeMainView } from '../actions/video-control-actions';
import BlackBoxComponent from '../components/black-box';
import { connect } from 'react-redux'

let clickHandlerCreator = function(dispatch) {
  let clickHandler = function(type, id, localVideos, remoteVideos) {
    dispatch(changeMainView(type, id, localVideos, remoteVideos))
  };

  return clickHandler
}

class BlackBox extends React.Component {
  constructor(props) {
  super(props);
  this.clickHandler = clickHandlerCreator(this.props.dispatch);
  }

  render() {
    return (
      <BlackBoxComponent userName={this.props.userName} onClick={() =>this.clickHandler(this.props.type, this.props.id, this.props.localVideos, this.props.remoteVideos)}>
      </BlackBoxComponent>
    )
  }
}

export default connect()(BlackBox);
