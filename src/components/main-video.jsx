import React from 'react';

export default class MainVideo extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div className="main-video">
                <video autoPlay="1" src="assets/SampleVideo_1280x720_1mb.mp4"></video>
            </div>
        );
    }
}