import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { store } from './store';
import { addItem, listItems } from './actions/todolist'
import { login, setLoginDetails } from './actions/user'
import { Provider, connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { LoginApp } from './components/Login';
import { TodoListApp } from './components/TodoList'
import DevTools from './devtools'

function mapStateToProps(state) {
  const { user } = state;
  return {user}
}

const { createClass, PropTypes } = React;

const AppBox = createClass({
  conextTypes: {
    store: PropTypes.object
  },
  componentWillMount() {
    const { dispatch } = this.props;
    let storedSessionLogin = sessionStorage.getItem('login');
    if (storedSessionLogin) {
      dispatch(setLoginDetails(JSON.parse(storedSessionLogin).loginResponse));
    }
  },
  componentDidMount() {
    this.unsubscribe = store.subscribe( () => this.forceUpdate() )
  },
  componentWillUnmount() {
    this.unsubscribe();
  },
  render() {
    const { user } = store.getState();
    return (
        <div>
          <DevTools store={store}  />
          <LoginApp
            msg={user.message}
            onLogin={ (u, p) => this.props.dispatch(login(u, p)) }
          />
        </div>
    );
  }
})

const App = connect(mapStateToProps)(AppBox);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    )
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
