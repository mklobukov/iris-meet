import React from 'react';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Arrow from 'material-ui/svg-icons/content/forward';
import FlatButton from 'material-ui/FlatButton';
import './chat.css';


const styles = {
  formStyle: {
    display: "flex",
    justifyContent: "center",
  },

  sendButton: {
    color: "rgb(0, 188, 212)",
    minWidth: "55px",
    marginRight: "5px"
  }
}


class PostMessageForm extends React.Component {
    constructor( props, context ) {
        super( props, context );
        this.state = {
          message: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onTextChange = this.onTextChange.bind(this)
    }
    // handleSubmit( event ) {
    //     event.preventDefault();
    //     console.log("Event e: ", event)
    //     if (this.messageInput.value.length > 0) {
    //       this.props.appendChatMessage( this.props.name, this.messageInput.value );
    //     }
    //     this.messageInput.value = '';
    // }

    handleSubmit(e) {
      e.preventDefault();
      if (this.state.message.length > 0) {
        this.props.appendChatMessage(this.props.name, this.state.message);
      }
      this.setState({
        message: ""
      })
    }

    onTextChange(e) {
      this.setState({
        message: e.target.value,
      });
    }


    render() {
        return (
            <form style={styles.formStyle} onSubmit={this.handleSubmit}>
              <TextField
                type="text"
                autoComplete="off"
                hintText="Enter message"
                multiLine={false}
                rows={1}
                rowsMax={3}
                value={this.state.message ? this.state.message : ""}
                ref={message => this.messageInput = message}
                onChange={this.onTextChange}
              />
            <FlatButton
              style={styles.sendButton}
              className={"send-button"}
              onClick={this.handleSubmit}
              icon={<Arrow color={"rgb(0, 188, 212)"} />}
            />
            </form>
        );
    }
}

export default PostMessageForm;


// <input type="text"
//        ref={message => this.messageInput = message}
//        placeholder="Message" />
//
//      <input type="submit" value="Send"/>
