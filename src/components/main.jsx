import React from 'react';
import MainVideo from './main-video';
import MeetToolbar from './meet-toolbar';
import HorizontalWrapper from './horizontal-wrapper';
import HorizontalBox from './horizontal-box';

export default class Main extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div>
                <MeetToolbar />
                <MainVideo />
                <HorizontalWrapper>
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                    <HorizontalBox />
                </HorizontalWrapper>
            </div>
        );
    }
}