import {
  LOGIN_USER, LOGOUT_USER
} from '../actions/user';

export const user = (state = {status: "LOGGEDOUT",
                              message: "Please log in ...",
                              username: ""}, action) =>
{
  switch(action.type) {
    case LOGOUT_USER:
      state = {status: "LOGGEDOUT",
          message: "Please log in ...",
          username: "",
          timestamp: action.timestamp
      }
      return state;
    case LOGIN_USER:
      const { loginResponse } = action;
      if (loginResponse.result === 'SUCCESS') {
        state = {...state,
            status: "LOGGEDIN",
            message : "Welcome",
            user: loginResponse,
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
