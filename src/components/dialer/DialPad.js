import React, { Component } from 'react'
import './css/style.css';
import Button from 'material-ui/FloatingActionButton';

const style = {
  marginRight: 20,
  color: "white"
};

class DialPad extends Component {
    constructor(props) {
        super(props);
        this.state = {
          // number:""
        }
    }



    render() {
      return (
        <div className="dial-pad">
          <div className="digits-row">
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '1')}}
            ><div>1</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '2')}}
            ><div>2</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '3')}}
            ><div>3</div></Button>
          </div>
          <div className="digits-row">
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '4')}}
            ><div>4</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '5')}}
            ><div>5</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '6')}}
            ><div>6</div></Button>
          </div>
          <div className="digits-row">
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '7')}}
            ><div>7</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '8')}}
            ><div>8</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '9')}}
            ><div>9</div></Button>
          </div>
          <div className="digits-row">
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '*')}}
            ><div>*</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '0')}}
            ><div>0</div></Button>
            <Button style={style}
              onClick={() => {this.props.onDialDigit(this.props.number + '#')}}
            ><div>#</div></Button>
          </div>
          <div className="digits-row">
            <Button style={style} secondary={this.props.onMute ? true : false} onClick={this.props.onMuteUnmute} >
              <i className={'fa fa-fw fa-microphone ' + (this.props.onMute ? 'fa-microphone-slash': 'fa-microphone')}></i>
            </Button>
            <Button style={style} secondary={this.props.onCall ? true : false}
                  onClick={this.props.onDial} disabled={this.props.disabled}>
                <i className={'fa fa-fw fa-phone '+ (this.props.onCall ? 'fa-close': 'fa-phone')}></i>
            </Button>
            <Button style={style} secondary={true}
              onClick={this.props.onDeleteDigit}>
              <i className={'fa fa-times-rectangle-o'}></i>
            </Button>
          </div>
        </div>
        );
    }
}

export default DialPad
