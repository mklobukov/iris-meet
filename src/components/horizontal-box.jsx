import React from 'react';

export default class HorizontalBox extends React.Component {
    constructor(props) {
        super(props)
    }

/*
<video autoPlay="1" src="assets/movie.mp4"></video>
*/

    render() {
        return (
            <div className="horizontal-box">
                {this.props.children}
            </div>
        );
    }
}
