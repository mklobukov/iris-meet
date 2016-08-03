import React, { Component } from 'react';
import Main from './components/main';

class App extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className='app-container'>
        <Main />
      </div>
    );
  }
}

export default App;
