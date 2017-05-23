import React from 'react';
import { changeMainView } from '../actions/video-control-actions';
import AvatarComponent from '../components/avatar';
import { connect } from 'react-redux';
import Identicon from 'identicon.js'


let options = {
  foreground: [255, 255, 255, 255],
  background: [0, 0, 0, 255],
  margin: 0.1,
  size: 128,
  format: 'svg'
};

let clickHandlerCreator = function(dispatch) {
  let clickHandler = function(type, id, localVideos, remoteVideos) {
    dispatch(changeMainView(type, id, localVideos, remoteVideos))
  };

  return clickHandler
}

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = clickHandlerCreator(this.props.dispatch);
  }

  render() {
    let data = new Identicon(this.props.hash, this.options).toString();
    return (
      <AvatarComponent
        data={data}
        userName={this.props.userName}
        onClick={() =>this.clickHandler(this.props.type, this.props.id, this.props.localVideos, this.props.remoteVideos)} >
      </AvatarComponent>
    )
  }
}

export default connect()(Avatar);
