import React, { Component } from 'react';
import DialPad from './DialPad';
import DisplayNumber from './DisplayNumber';
import StatusText from './StatusText';
import RemoteAudio from './RemoteAudio'
import './css/style.css';

class IrisDialer extends Component {

  constructor(props){
    super(props);
    this.state = {
      number: "",
      onCall:false,
      onMute: false,
      onHold: false,
      statusText: "Dial a number",
      localStream: null,
      remoteStream: null,
    }
  }

  render() {
    return (
      <div className="iris-dialer-app">
        <div className="iris-dialer-container">
          <DisplayNumber number={this.props.number}
            onNumberChange={this.props.onNumberChange}/>
          <DialPad number={this.props.number}
            onDialDigit={this.props.onDialDigit ? this.props.onDialDigit : this._onDialDigit}
            onDeleteDigit={this.props.onDeleteDigit ? this.props.onDeleteDigit : this._onDeleteDigit}
            onMuteUnmute={this.props.onMuteUnmute}
            onDial={this.props.onDial}
            onTextChange={this.props.onTextChange}
            onCall={this.state.onCall}
            onMute={this.state.onMute}/>
          <StatusText number={this.props.number} statusText={this.props.statusText}/>
          <RemoteAudio />
        </div>
      </div>
    );
  }
  ///////////////////////////////////////////////////////////////////////
  //functions that are local to the dialer. Give an option to override.
  //these functions don't involve any reference to the iris APIs.
  _onDialDigit(number) {
    console.log("Number : " + number);
    this.setState({number : number, statusText:"Dialing"});
  }

  _onDeleteDigit(){
    let number = this.state.number.slice(0, -1);
    console.log("Number : " + number);
    this.setState({number : number});
  }
  ///////////////////////////////////////////////////////////////////////

  //the rest of the functions will need to be passed as props. They are:
    // -- onMuteUnmute
    // -- onHoldUnhold
    // -- onNumberChange
    // -- onDial
    //   *--- calls irisConnect
    //     *-- calls irisStream
    //       *- calls irisSession
}


export default IrisDialer;
