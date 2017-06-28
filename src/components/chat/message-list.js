import React from 'react';
import Message from './message';
import './chat.css'

const styles = {
  messages: {
    display: "flex",
    //flexDirection: "column-reverse"
    flexDirection: "column-reverse"
  }
}

class MessageList extends React.Component {
    render() {

        // let out = document.getElementById("chat-messages-id");
        // if (out) {
        //   // allow 1px inaccuracy by adding 1
        //   const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
        //   if (isScrolledToBottom) out.scrollTop = out.scrollHeight - out.clientHeight;
        // }


        return (
          this.props.messages.length > 0 ?
            (<div style={styles.messages} className={"chat-messages"} id={"chat-messages-id"}>
                {
                    this.props.messages.map( message =>
                        <Message timestamp={message.timestamp}
                                 sender={message.sender}
                                 text={message.text}
                                 key={message.id} />
                      )
                }
            </div> )
            : <div className={"chat-messages"} >No messages here yet</div>
        );
    }
}

export default MessageList;
