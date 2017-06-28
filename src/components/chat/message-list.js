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

    componentDidUpdate() {
      //force the messages div to stay scrolled down
      //unless user scrolls up. Then it will stay where it is.
      //If the user scrolls all the way down again, stay there.
      const chat = document.getElementById("chat-messages-id");
      if (chat) {
        const diff = chat.scrollHeight - chat.clientHeight;
        if (Math.abs(diff - chat.scrollTop) < 50) {
          chat.scrollTop = diff;
        }
      }
    }

    render() {
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
