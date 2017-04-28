import {
  LOGIN_USER
} from '../actions/user';

export const user = (state = {status: "LOGGEDOUT",
                              message: "Please log in ...",
                              username: ""}, action) =>
{

  switch(action.type) {
    case LOGIN_USER:
      if (action.loginResponse.result === 'SUCCESS') {
        state = {...state,
            status: "LOGGEDIN",
            message : "Welcome " + action.loginResponse.username,
            username: "",
            timestamp: action.timestamp
          }
      }
      else {
        state = {...state,
            message : "Invalid username/password.",
            username: "",
            timestamp: action.timestamp
          }
      }
      return state;
      default:
        return state
  }
}
