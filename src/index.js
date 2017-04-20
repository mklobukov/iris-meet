import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './app';
import Main from './components/main';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import reducersCombined from './reducers'
import videoControlReducer from './reducers/video-control-reducer'
import thunk from 'redux-thunk'

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
