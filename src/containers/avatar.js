import React from 'react';
import { changeMainView } from '../actions/video-control-actions';
import AvatarComponent from '../components/avatar';
import { connect } from 'react-redux';
import Identicon from 'identicon.js'

let r = Math.random() * 255
let g = Math.random() * 255
let b = Math.random() * 255

let options = {
  foreground: [r, g, b, 255],
  background: [240, 240, 240, 255],
  margin: 0.1,
  size: 512,
  format: 'svg'
};

let clickHandlerCreator = function(dispatch) {
  let clickHandler = function(type, id, domId, triggeredOnClick, localVideos, remoteVideos) {
    dispatch(changeMainView(type, id, domId, triggeredOnClick, localVideos, remoteVideos))
  };

  return clickHandler
}

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = clickHandlerCreator(this.props.dispatch);
  }

  render() {
    console.log("What's up with options: ", options)
    let data = new Identicon(this.props.hash, options).toString();
    return (
      <AvatarComponent
        data={data}
        userName={this.props.userName}
        onClick={() =>this.clickHandler(this.props.type, this.props.id, this.props.domId, true, this.props.localVideos, this.props.remoteVideos)}>
      </AvatarComponent>
    )
  }
}

export default connect()(Avatar);
