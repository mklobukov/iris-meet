// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './app';
import Main from './components/main';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducersCombined from './reducers';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Example from './components/dialer/Example';

let store = createStore(
  reducersCombined,
  applyMiddleware(thunk)
);

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route handler={App}>
          <IndexRoute component={Main} />
          //<Route path='/' component={Main} />
          <Route path='/:roomname' component={Main} />
          <Route path='dialerapp/dialer' component={Example} />
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.querySelector('#target')

);
