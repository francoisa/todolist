import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers'

const initialState = { user: { status: "LOGGEDOUT", message: "Please log in:" }};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(thunk)
  ));
