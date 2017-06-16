import React, {Component} from 'react'

class StatusText extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render(){
    return(
      <div>
        {this.props.statusText} {this.props.number}
      </div>
    );
  }

}

export default StatusText
