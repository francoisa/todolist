import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { expect } from 'chai';
import {
  LOGIN_USER, LOGOUT_USER, setLoginDetails, login, logout
} from '../src/actions/user';
import { fetch } from 'isomorphic-fetch';
var fetchMock = require('fetch-mock');
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({ todos: [] })

describe("The user Actions", () => {

  it("setLoginDetails() creates a valid action", () => {
    const details = {username: 'francoisa'}

    const expected_type = LOGIN_USER
    const actual_state = setLoginDetails(details)
    expect(actual_state.type).to.equal(expected_type)
    expect(actual_state.loginResponse).to.deep.equal(details)
  })

  it("login() creates a valid action", () => {
    const path = '/api/authenticate/francoisa/password?api_key=849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
    const loginResponse = {username: 'francoisa'}
    fetchMock.get(path, loginResponse)
    return store.dispatch(login('francoisa', 'password'))
            .then(() => {
                const expected_state = {
                  loginResponse: loginResponse,
                  type: LOGIN_USER
                };
                const actual_state = store.getActions();
                expect(actual_state[0].type).to.equal(expected_state.type);
                expect(actual_state[0].loginResponse).to.deep.equal(expected_state.loginResponse);
            });
  })

  it("logout() creates a valid action", () => {
    const expected_type = LOGOUT_USER
    const actual_state = logout('francoisa')
    expect(actual_state.type).to.equal(expected_type)
  })
})
