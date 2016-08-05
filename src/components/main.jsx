import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from './meet-toolbar';
import HorizontalWrapper from './horizontal-wrapper';
import HorizontalBox from './horizontal-box';
import LoginPanel from './login-panel';
import UserActions from '../actions/user-actions';
import UserStore from '../stores/user-store';
import UserStoreConstants from '../constants/user-store-constants';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          showRoom: false,
          showUser: false,
        }

        this.loginCallback = this._userLoggedIn.bind(this);
        this.loginFailedCallback = this._userFailedLogin.bind(this);
    }

    componentDidMount() {
      UserStore.addUserListener(UserStoreConstants.USER_LOGGED_IN_EVENT, this.loginCallback);
      UserStore.addUserListener(UserStoreConstants.USER_LOGIN_FAILED_EVENT, this.loginFailedCallback);
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
    }

    _userLoggedIn() {
      this.setState({
        showRoom: false,
        showUser: false,
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
      UserActions.loginUser(userName, roomName);
    }

    render() {
        return (
            <div>
                <MeetToolbar />
                <MainVideo />
                <HorizontalWrapper>
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
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
}
