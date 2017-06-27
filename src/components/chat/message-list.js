import React from 'react';
import Message from './message';
import './chat.css'

class MessageList extends React.Component {
    render() {
        return (
            <div className={"chat-messages"} id={"chat-messages-id"}>
                {
                    this.props.messages.map( message =>
                        <Message timestamp={message.timestamp}
                                 sender={message.sender}
                                 text={message.text}
                                 key={message.id} />
                      )
                }
            </div>
        );
    }
}

export default MessageList;
