import React from 'react';

export default class MeetToolbar extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div id="header">
                <span id="toolbar">
                  <a className="button"><i className="fa fa-microphone" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-camera" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-comments" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-desktop" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-expand" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-cogs" aria-hidden="true"></i></a>
                  <a className="button"><i className="fa fa-phone text-danger" aria-hidden="true"></i></a>
                </span>
            </div>
        );
    }
}