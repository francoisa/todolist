import 'whatwg-fetch'
export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

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
    },
    method: 'get',
  }

  return dispatch => {
    return fetch(`/api/authenticate/${user}/${pwd}?api_key=${APIKEY}`, options)
      .then(response => response.json())
    .then(json => dispatch(setLoginDetails(json)))
  }
}

export function logout() {
  const logoutData = {
    type: LOGOUT_USER,
    timestamp: Date.now()
  };
  sessionStorage.removeItem('login');
  return logoutData;
}
