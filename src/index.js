import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { store } from './store';
import { setLoginDetails } from './actions/user'
import { Provider, connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { LoginApp } from './components/Login';
import { TodoListApp } from './components/TodoList'
import {
  QueryRenderer,
  graphql,
} from 'react-relay';
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

function NotAuthenticated(props) {
  const { user } = store.getState();
  if (user.status === "LOGGEDOUT") {
      return (<div>{props.children}</div>);
  }
  else {
    return null;
  }
}

function Authenticated(props) {
  const { user } = store.getState();
  if (user.status === "LOGGEDIN") {
      return (<div>{props.children}</div>);
  }
  else {
    return null;
  }
}

class AppBox extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    let storedSessionLogin = sessionStorage.getItem('login');
    if (storedSessionLogin) {
      let details = JSON.parse(storedSessionLogin).loginResponse;
      dispatch(setLoginDetails(details));
    }
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe( () => this.forceUpdate() )
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
        <div>
          <NotAuthenticated>
            <LoginApp/>
          </NotAuthenticated>
          <Authenticated>
            <TodoListApp/>
          </Authenticated>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = null;

const App = connect(mapStateToProps, mapDispatchToProps)(AppBox);

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

function fetchQuery(
  operation,
  variables,
) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
