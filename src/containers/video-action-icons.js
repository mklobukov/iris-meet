import React from 'react';
import IconButton from 'material-ui/IconButton';
import VolumeUp from 'material-ui/svg-icons/av/volume-up';
import VolumeOff from 'material-ui/svg-icons/av/volume-off';
import Videocam from 'material-ui/svg-icons/av/videocam';
import VideocamOff from 'material-ui/svg-icons/av/videocam-off';


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    // verticalAlign: "top",
    // height: "30px",
    marginBottom: "50px",
    marginRight: "-5px",
    background: "linear-gradient(to left, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)",
    height: "150px",
    marginTop: "0px"
  },

  topIconStyle : {
    color : "rgb(0, 188, 212)",

    //paddingBottom:

  },

  bottomIconStyle : {
    color : "rgb(0, 188, 212)",
    // marginBottom: "40px",

  },

  tooltipStyles : {
    display: "none"

  }
}

export default class UserNameBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audioMuted: false,
      videoMuted: false
    }
  }

_muteAudio() {
  const jid = this.props.participantJid;
  const muted = this.state.audioMuted;
  this.props.muteAudio(jid, !muted);
  this.setState({
    audioMuted: !muted,
  });
}

_muteVideo() {
  console.log("THIS PROPSSSS: ", this.props)
  const jid = this.props.participantJid;
  const muted = this.state.videoMuted;
  this.props.muteVideo(jid, !muted);
  this.setState({
    videoMuted: !muted,
  });
}



  render() {
    return (
      <div id="video-action-icons" style={styles.container}>
        <IconButton iconStyle={styles.topIconStyle}
          onTouchTap={this._muteAudio.bind(this)}>
            {this.state.audioMuted ?
              <VolumeOff />
            :
              <VolumeUp />
            }
        </IconButton>

        <IconButton iconStyle={styles.bottomIconStyle}
          tooltip="Mute Video"
          tooltipPosition="top-left"
          tooltipStyles={styles.tooltipStyles}
          onTouchTap={this._muteVideo.bind(this)}>
          {this.state.videoMuted ?
            <VideocamOff />
          :
            <Videocam />
          }
        </IconButton>
      </div>
    )
  }
}

// WITH TOOLTIP. It interferes with clicking
// <IconButton iconStyle={styles.topIconStyle}
//   tooltip="Mute Audio"
//   tooltipPosition="top-left"
//   tooltipStyles={styles.tooltipStyles}
//   onTouchTap={this._muteAudio.bind(this)}>
//     {this.state.audioMuted ?
//       <VolumeOff />
//     :
//       <VolumeUp />
//     }
// </IconButton>
