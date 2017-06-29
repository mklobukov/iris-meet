import React from 'react';
import TextField from 'material-ui/TextField';

const styles = {
  "textStyle" : {
    "color" : "rgb(0, 188, 212)",
    "fontSize" : "12px",
  },
  "hintStyle" : {
    "color" : "white",
    "fontSize" : "10px"
  },
  "boxStyle" : {
    "width" : "75%"
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
    //set limit on the number of characters
    if (e.target.value.length <= this.props.charLimit) {
      this.setState({
        name: e.target.value,
      }, () => {console.log("updating name: ", this.state.name)});
    }
    else {
      console.log("Username can't be longer than", this.props.charLimit, "chars")
    }
  }

  _changeMyName(e) {
    e.preventDefault();
    this.props.setDisplayName(this.state.name);
    return false;
  }

  render() {
    return(
      <div>
        <form onSubmit={this._changeMyName.bind(this)} >
          <TextField
            inputStyle={styles.textStyle}
            hintStyle={styles.hintStyle}
            style={styles.boxStyle}
            type="text"
            autoComplete={"off"}
            multiLine={false}
            className="user-name-box"
            id="user-name-box"
            hintText={"Edit your name"}
            value={this.state.name ? this.state.name : ""}
            onChange={this._onTextChange.bind(this)}
          />
          </form>
      </div>
    );
  }

}
