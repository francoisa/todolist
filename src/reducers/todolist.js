import {
  ADD_ITEM
} from '../actions/todolist';

export const todolist = (state = {items: []}, action) => {

    switch(action.type) {
      case ADD_ITEM:
        return state;
      default:
        return state;
    }
}
