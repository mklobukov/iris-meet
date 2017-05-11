import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './app';
import Main from './components/main';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducersCombined from './reducers';
import thunk from 'redux-thunk';

let store = createStore(
  reducersCombined,
  applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route handler={App}>
        <IndexRoute component={Main} />
        //<Route path='/' component={Main} />
        <Route path='/:roomname' component={Main} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#target')

);
