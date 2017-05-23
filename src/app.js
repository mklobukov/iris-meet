import React, { Component } from 'react';
import Main from './components/main';

//for onTouchTap. Not including/executing this causes error
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <div className='app-container'>
        <Main />
      </div>
    );
  }
}

export default App;
