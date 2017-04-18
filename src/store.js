import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import DevTools from './devtools';
import reducer from './reducers'

const configureStore = compose(applyMiddleware(thunk), DevTools.instrument())(createStore)

export const store = configureStore(reducer)
