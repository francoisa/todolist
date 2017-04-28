export const ADD_ITEM = 'ADD_ITEM'
export const LIST_ITEMS = 'LIST_ITEMS'

export function addItem(item) {
  let action = { type: ADD_ITEM,
    status: 'SUCCESS',
    item: { id: 1, name: item }
  }
  return action;
}

export function listItems() {
  let action = { type: LIST_ITEMS,
    items: [ "Hello World", "Ipsum Lorem"]
  }
  return action;
}
