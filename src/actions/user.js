import fetch from 'isomorphic-fetch'
export const LOGIN_USER = 'LOGIN_USER'

export function setLoginDetails(json) {
  const loginData = {
    type: LOGIN_USER,
    loginResponse: json,
    timestamp: Date.now()
  };
  sessionStorage.setItem('login',JSON.stringify(loginData));
  return loginData;
}

export function login(user, pwd) {
  const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
  const options = {headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 1234567890'
  },
  method: 'get',
  }

  return dispatch => {
    return fetch(`/api/user/authenticate/${user}/${pwd}?api_key=${APIKEY}`, options)
      .then(response => response.json())
    .then(json => dispatch(setLoginDetails(json)))
  }
}
