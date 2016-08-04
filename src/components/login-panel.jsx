import React from 'react';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="login-panel">
        <form className="form">
          {this.props.showUser === true ? <div className="form-group">
            <input type="text" className="form-control" id="userName" placeholder="User name" />
          </div> : null}
          {this.props.showRoom === true ? <div className="form-group">
            <input type="text" className="form-control" id="roomName" placeholder="Room name" />
          </div> : null}
          <button type="submit" className="btn btn-default">Accept</button>
        </form>
      </div>
    );
  }
}
