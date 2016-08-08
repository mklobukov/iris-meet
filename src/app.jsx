import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './index';
import Main from './components/main';

render(
  <Router history={browserHistory}>
    <Route handler={App}>
      //<IndexRoute component={Main} />
      //<Route path='/' component={Main} />
      <Route path='/:roomname' component={Main} />
    </Route>
  </Router>, document.querySelector('#target')
);
