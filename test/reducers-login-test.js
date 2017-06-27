import { expect } from 'chai';
import {
  LOGIN_USER, LOGOUT_USER
} from '../src/actions/user';
import {
  user
} from '../src/reducers/user';

describe("login Reducer", () => {

  it("LOGIN_USER success", () => {
    const state = {}
    const action = {
      type: LOGIN_USER,
      loginResponse: {result: "SUCCESS"},
      timestamp: 'now'
    }
    const expected_state = {
      status: "LOGGEDIN",
      message : "Welcome",
      user: action.loginResponse,
      timestamp: action.timestamp
    }
    const actual_state = user(state, action)
    expect(actual_state).to.deep.equal(expected_state)
  })

  it("LOGOUT_USER success", () => {
    const state = {}
    const action = {
      type: LOGOUT_USER,
      timestamp: 'now'
    }
    const expected_state = {
      status: "LOGGEDOUT",
      message: "Please log in ...",
      username: "",
      timestamp: action.timestamp
    }
    const actual_state = user(state, action)
    expect(actual_state).to.deep.equal(expected_state)
  })
})
