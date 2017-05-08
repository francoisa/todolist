import {
  LOGIN_USER
} from '../actions/user';

export const user = (state = {status: "LOGGEDOUT",
                              message: "Please log in ...",
                              username: ""}, action) =>
{
  switch(action.type) {
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
