import React from 'react';
import Identicon from 'identicon.js'

const r = Math.random() * 255
const g = Math.random() * 255
const b = Math.random() * 255

const options = {
  foreground: [r, g, b, 255],
  background: [240, 240, 240, 255],
  margin: 0.1,
  size: 512,
  format: 'svg'
};

const avatarImage = {
  width: '500px',
  height: '600px',
}

class AvatarImage extends React.Component {
  constructor(props) {
    super(props);
    this.data = new Identicon(this.props.hash, options).toString();
  }

  render() {
    return (
      <img style={avatarImage} src={"data:image/svg+xml;base64, " + this.data} />
    )
  }
}

export default AvatarImage;
