import fetch from 'isomorphic-fetch'
export const LOGIN_USER = 'LOGIN_USER'

function setTodoListDetails(loginResponse, json) {
  const todoListData = {
    type: LOGIN_USER,
    loginResponse: loginResponse,
    itemList: json,
    timestamp: Date.now()
  };
  return todoListData;
}

function initTodoList(loginResponse) {
  const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'get',
  }
  return dispatch => {
    return fetch(`/api/todo/${loginResponse.username}?api_key=${APIKEY}`, options)
      .then(response => response.json())
    .then(json => dispatch(setTodoListDetails(loginResponse, json)))
  }
}

export function setLoginDetails(json) {
  if (json.result === 'SUCCESS') {
    return initTodoList(json);
  }
  else {
    const loginData = {
      type: LOGIN_USER,
      loginResponse: json,
      timestamp: Date.now()
    };
    sessionStorage.setItem('login',JSON.stringify(loginData));
    return loginData;
  }
}

export function login(user, pwd) {
  const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'get',
  }

  return dispatch => {
    return fetch(`/api/authenticate/${user}/${pwd}?api_key=${APIKEY}`, options)
      .then(response => response.json())
    .then(json => dispatch(setLoginDetails(json)))
  }
}
