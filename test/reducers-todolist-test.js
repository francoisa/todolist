import { expect } from 'chai';
import {
  ADD_ITEM, LIST_ITEMS
} from '../src/actions/todolist';
import { todolist } from '../src/reducers/todolist';

describe("todolist Reducer", () => {

  it("ADD_ITEM success", () => {
    const state = {}
    const action = {
      type: ADD_ITEM,
      item: 'list item',
    }
    const expected_state = {
      items: [ action.item ],
    }
    const actual_state = todolist(state, action)
    expect(actual_state).to.deep.equal(expected_state)
  })

  it("LIST_ITEMS success", () => {
    const state = {}
    const action = {
      type: LIST_ITEMS,
      items: [ 'list item 01', 'list item 02'],
      user: 'francoisa',
    }
    const expected_state = {
      items: action.items,
      user: action.user,
    }
    const actual_state = todolist(state, action)
    expect(actual_state).to.deep.equal(expected_state)
  })
})
