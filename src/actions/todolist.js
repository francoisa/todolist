import fetch from 'isomorphic-fetch'

export const ADD_ITEM = 'ADD_ITEM'
export const LIST_ITEMS = 'LIST_ITEMS'


export function addItem(user, item) {
  const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
  }
  return dispatch => {
    return fetch(`/api/todo?api_key=${APIKEY}`, item, options)
      .then(response => response.json())
    .then(json => dispatch(listItems(user)))
  }
}

function setListItems(user, json) {
  let action = { type: LIST_ITEMS,
    items: json,
    user: user
  }
  return action;
}

export function listItems(user) {
  const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 1234567890'
    },
    method: 'get',
  }

  return dispatch => {
    return fetch(`/api/todo/${user}?api_key=${APIKEY}`, options)
      .then(response => response.json())
    .then(json => dispatch(setListItems(user, json)))
  }
}
