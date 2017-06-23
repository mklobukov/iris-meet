import React from 'react';
import TextField from 'material-ui/TextField';

const styles = {
  "textStyle" : {
    "color" : "rgb(0, 188, 212)",
    "fontSize" : "12px"
  },
  "hintStyle" : {
    "color" : "white",
    "fontSize" : "10px"
  }
}

export default class UserNameBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
    }
  }

  _onTextChange(e) {
    this.setState({
      name: e.target.value,
    }, () => {console.log("updating name: ", this.state.name)});
  }

  _changeMyName(e) {
    e.preventDefault();
    console.log("inside change my name")
    this.props.setDisplayName(this.state.name);
    return false;
  }

  render() {
    return(
      <div>
        <form onSubmit={this._changeMyName.bind(this)}>
          <TextField
            inputStyle={styles.textStyle}
            hintStyle={styles.hintStyle}
            type="text"
            className="user-name-box"
            id="user-name-box"
            hintText={"Edit your name"}
            value={this.state.name}
            onChange={this._onTextChange.bind(this)}
          />
          </form>
      </div>
    );
  }

}
