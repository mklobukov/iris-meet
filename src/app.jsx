import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import App from './index';
import Main from './components/main';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

render(
  <Router history={appHistory}>
    <Route handler={App}>
      <IndexRoute component={Main} />
      <Route path='/' component={Main} />
      <Route path='/:roomname' component={Main} />
    </Route>
  </Router>, document.querySelector('#target')
);
