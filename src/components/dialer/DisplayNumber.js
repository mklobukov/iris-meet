import React, {Component} from 'react';
import './css/style.css'
import TextField from 'material-ui/TextField';

//old input
// <input type="tel" className="form-control" placeholder="215-286-2328"
//     value={this.props.number} onChange={this.props.onNumberChange}/>
const textFieldStyle = {
    "textAlign" : "center",
}


class DisplayNumber extends Component {
  render(){
    return(
    <div>
      <TextField
        style={textFieldStyle}
        type="tel"
        className="form-control"
        id="userName"
        hintText="215-286-2328"
        value={this.props.number}
        onChange={this.props.onNumberChange}
      />
    </div>

    );
  }
}

export default DisplayNumber
