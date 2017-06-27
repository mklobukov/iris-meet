import React from 'react';
import MessageList from './message-list';
import ClearButton from './clear-button';
import PostMessageForm from './post-message-form';

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     paddingLeft: "10px",
//     paddingRight: "10px",
//   },
//
//   postMessageForm: {
//     alignSelf: "flex-end",
//   }
// }

class ChatBox extends React.Component {
    constructor( props, context ) {
        super( props, context );
        // this.state = {
        //     messages: []
        // };

        this.appendChatMessage = this.appendChatMessage.bind( this );
        //this.clearMessages = this.clearMessages.bind( this );
    }

    appendChatMessage( sender, text ) {
        // let newMessage = {
        //     id: this.state.messages.length + 1,
        //     timestamp: new Date().getTime(),
        //     sender: sender,
        //     text: text
        // };
        // this.setState({ messages: [ ...this.state.messages, newMessage ] });
        //this.props.sendChatMessage("testJid", newMessage.text)
        this.props.sendChatMessage(this.props.myId, text)
    }

    render() {
        let isDisabled = this.props.messages.length === 0;
        return (
            <div>
                <MessageList messages={this.props.messages} />
                <PostMessageForm name={this.props.name} appendChatMessage={this.appendChatMessage} />
            </div>
        );
    }
}

export default ChatBox;


// clearMessages() {
//     this.setState( { messages: [] } );
// }
// <ClearButton
//     clearMessages={this.clearMessages}
//     isDisabled={isDisabled} />
