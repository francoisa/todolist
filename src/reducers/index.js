import { combineReducers } from 'redux'
import { user } from './user'
import { todolist } from './todolist'

const reducer = combineReducers({user, todolist})

export default reducer
