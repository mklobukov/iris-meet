import React from 'react';
import Message from './message';

class MessageList extends React.Component {
    render() {
        return (
            <div>
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
