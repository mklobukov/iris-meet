import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from './meet-toolbar';
import HorizontalWrapper from './horizontal-wrapper';
import HorizontalBox from './horizontal-box';
import LoginPanel from './login-panel';
import UserActions from '../actions/user-actions';
import UserStore from '../stores/user-store';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          showRoom: false,
          showUser: false,
        }
    }

    componentDidMount() {
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
                    showRoom={this.state.showRoom}
                    showUser={this.state.showUser}
                  /> : null}
            </div>
        );
    }
}
