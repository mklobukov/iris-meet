import React from 'react';

export default class HorizontalBox extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div className="horizontal-box">
                <video autoPlay="1" src="assets/movie.mp4"></video>
            </div>
        );
    }
}