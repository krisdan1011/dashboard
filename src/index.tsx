
//Import third-party libraries
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, IndexRoute, Router, browserHistory, EnterHook, RouterState, RedirectFunction } from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

//Import our pages
import Dashboard from './frames/Dashboard';
import HomeView from './views/HomeView';
import NotFoundView from './views/NotFoundView';
import AboutView from './views/AboutView';
import LoginView from './views/LoginView';

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

console.log('store');
console.log(store);

let checkAuth:EnterHook = function(nextState: RouterState, replace: RedirectFunction) {
  let { token } = store.getState().session;

  console.log('checking auth');
  console.log(store.getState());
  console.log('your token: ');
  console.log(token);
  

  console.log('nextState ');
  console.log(nextState);

  console.log('nextState.location.state ' + nextState.location.state);
  console.log('nextState.location.pathname ' + nextState.location.pathname);

  // check if the path isn't dashboard
  // that way we can apply specific logic
  // to display/render the path we want to
  if (nextState.location.pathname !== '/') {
    if (token) {
      if (nextState.location.state && nextState.location.pathname) {
        replace(nextState.location.pathname);
      } else {
        replace('/login');
      }
    }
  } else {
    // If the user is already logged in, forward them to the homepage
    if (!token) {
      if (nextState.location.state && nextState.location.pathname) {
        replace(nextState.location.pathname);
      } else {
        replace('/login');
      }
    }
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/login" component={LoginView} />
      <Route path="/" component={Dashboard} onEnter={checkAuth}>
          <IndexRoute component={HomeView}/>
          <Route path="about" component={AboutView}/>
          <Route path="*" component={NotFoundView} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('container')
);