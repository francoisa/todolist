import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { expect } from 'chai';
import {
  ADD_ITEM, LIST_ITEMS, addItem, delItem, editItem, listItems
} from '../src/actions/todolist';
import { fetch } from 'isomorphic-fetch';
var fetchMock = require('fetch-mock');
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({ todos: [] })

const API_KEY='849b7648-14b8-4154-9ef2-8d1dc4c2b7e9'

describe("The todolist Actions", () => {

  it("addItem() creates a valid action", () => {
    const user = 'francoisa';
    const id = 1;
    const path = '/api/todo/' + user  + '?api_key=' + API_KEY;
    const item = "item";
    const stat = 0;
    const json = JSON.stringify([{id: id, item: item, stat: stat}])
    const addResponse = { type: LIST_ITEMS, items: json, user: user }
    fetchMock.post(path, addResponse)
    fetchMock.get(path, addResponse)
    return store.dispatch(addItem(user, item, stat))
            .then(() => {
                const expected_state = { type: LIST_ITEMS, items: json, user: user }
                const actual_state = store.getActions();
                expect(actual_state[0].type).to.equal(expected_state.type);
                expect(actual_state[0].json).to.deep.equal(expected_state.josn);
            });
  })
})
