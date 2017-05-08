import {
  ADD_ITEM, LIST_ITEMS
} from '../actions/todolist';

export const todolist = (state = {items: []}, action) => {

    switch(action.type) {
      case ADD_ITEM:
        state = {...state }
        if (!state.items) {
          state.items = [];
        }
        state.items.push(action.item)
        return state;
      case LIST_ITEMS:
        state = {...state,
          items: action.items,
          user: action.user }
        return state;
      default:
        return state;
    }
}
