import 'whatwg-fetch'

export const ADD_ITEM = 'ADD_ITEM'
export const LIST_ITEMS = 'LIST_ITEMS'

const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';

export function editItem(user, id, item, stat) {
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({content: item, status: stat})
  }
  return dispatch => {
    return fetch(`/api/todo/${id}?api_key=${APIKEY}`, options)
      .then(response => response.json())
      .then(json => listItemsSync(user))
      .then(json => dispatch(setListItems(user, json)))
  }
}

export function delItem(user, id) {
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  }
  return dispatch => {
    return fetch(`/api/todo/${id}?api_key=${APIKEY}`, options)
      .then(response => response.json())
      .then(json => listItemsSync(user))
      .then(json => dispatch(setListItems(user, json)))
  }
}

export function addItem(user, item, stat) {
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({content: item, status: stat})
  }

  return dispatch => {
    return fetch(`/api/todo/${user}?api_key=${APIKEY}`, options)
      .then(response => response.json())
      .then(json => listItemsSync(user))
      .then(json => dispatch(setListItems(user, json)))
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
      'Content-Type': 'application/json'
    },
    method: 'GET',
  }
  const { username } = user;
  return dispatch => {
    return fetch(`/api/todo/${username}?api_key=${APIKEY}`, options)
      .then(response => response.json())
    .then(json => dispatch(setListItems(user, json)))
  }
}

function listItemsSync(user) {
  const APIKEY = '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9';
  const options = {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 1234567890'
    },
    method: 'get',
  }

  return fetch(`/api/todo/${user}?api_key=${APIKEY}`, options)
      .then(response => response.json());
}
