import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from './meet-toolbar';
import HorizontalWrapper from './horizontal-wrapper';
import HorizontalBox from './horizontal-box';
import LoginPanel from './login-panel';
import UserActions from '../actions/user-actions';
import UserStore from '../stores/user-store';
import UserStoreConstants from '../constants/user-store-constants';
import VideoControlStore from '../stores/video-control-store';
import VideoControlStoreConstants from '../constants/video-control-store-constants';
import { withRouter } from 'react-router';
import withWebRTC, { LocalVideo, RemoteVideo, WebRTCConstants } from 'iris-react-webrtc';

export default withWebRTC(withRouter(class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoom: false,
      showUser: false,
    }

    this.loginCallback = this._userLoggedIn.bind(this);
    this.loginFailedCallback = this._userFailedLogin.bind(this);
    this.mainVideoChangeCallback = this._onMainVideoChange.bind(this);
  }

  componentDidMount() {
    UserStore.addUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
    UserStore.addUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
    VideoControlStore.addVideoControlListener(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT, this.mainVideoChangeCallback);
    console.log('roomName: ' + this.props.params.roomname);
    let showRoom = false;
    let showUser = false;
    if (this.props.params.roomname === undefined) {
      // no room name specified in URL so show dialog
      // to ask for room name
      showRoom = true;
    }

    const userName = localStorage.getItem('irisMeet.userName');
    if (userName === null) {
      // we do not have user name stored so ask for user name
      showUser = true;
    }

    if (showRoom || showUser) {
      this.setState({
        showRoom,
        showUser,
      });
    } else {
      // we have both userName and roomName so login
      UserActions.loginUser(userName, this.props.params.roomname);
    }
  }

  componentWillUnmount() {
    UserStore.removeUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
    UserStore.removeUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
    VideoControlStore.addVideoControlListener(VideoControlStoreConstants.VIDEO_CONTROL_MAIN_VIEW_UPDATED_EVENT, this.mainVideoChangeCallback);
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      UserActions.leaveRoom();
      this.endSession();
    });
  }

  _onMainVideoChange() {
    console.log('Video type: ' + VideoControlStore.videoType);
    console.log('Video index: ' + VideoControlStore.videoIndex);
  }

  _userLoggedIn() {
    this.setState({
      showRoom: false,
      showUser: false,
    }, () => {
      this.props.initializeWebRTC(UserStore.user, UserStore.room, UserStore.domain, UserStore.token);
    });
  }

  _userFailedLogin(error) {
    // TODO: login error handler
    console.log('Login failure: ');
    console.log(error);
  }

  _onLoginPanelComplete() {
    let userName = this.refs.loginpanel.userName ? this.refs.loginpanel.userName : localStorage.getItem('irisMeet.userName');
    let roomName = this.refs.loginpanel.roomName ? this.refs.loginpanel.roomName : this.props.params.roomname;
    localStorage.setItem('irisMeet.userName', userName);
    //UserActions.loginUser(userName, roomName);
    //this.props.router.push('/' + roomName);
    const hostname = window.location.href;
    const newLocation = hostname + roomName;
    console.log('NEW LOCATION: ' + newLocation);
    window.location.assign(hostname + roomName);
  }

  render() {
    return (
      <div>
      <MeetToolbar />
      <MainVideo>
        {this.props.localVideos.length > 0 ?
          <LocalVideo
            key={this.props.localVideos[0].video.index}
            video={this.props.localVideos[0].video}
            audio={this.props.localVideos[0].audio}
          /> : null}
      </MainVideo>
      <HorizontalWrapper>
          {this.props.localVideos.map((connection) => {
            return (
              <HorizontalBox
                key={connection.video.index}
                type='local'
                id={connection.video.index}
              >
                <LocalVideo key={connection.video.index} video={connection.video} audio={connection.audio} />
              </HorizontalBox>
            );
          })}
          {this.props.remoteVideos.map((connection) => {
            return (
              <HorizontalBox
                key={connection.video.index}
                type='remote'
                id={connection.video.index}
              >
                <RemoteVideo key={connection.video.index} video={connection.video} audio={connection.audio} />
              </HorizontalBox>
            );
          })}
      </HorizontalWrapper>
      {this.state.showUser || this.state.showRoom ?
        <LoginPanel
          ref='loginpanel'
          showRoom={this.state.showRoom}
          showUser={this.state.showUser}
          onAction={this._onLoginPanelComplete.bind(this)}
        /> : null}
      </div>
    );
  }
}));
