import React from 'react';

export default class MainVideo extends React.Component {
    constructor(props) {
        super(props)
    }

/*
<video autoPlay="1" src="assets/SampleVideo_1280x720_1mb.mp4"></video>
*/

    render() {
        return (
            <div className="main-video">
              {this.props.children}
            </div>
        );
    }
}
