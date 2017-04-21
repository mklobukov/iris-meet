import { combineReducers } from 'redux'
import userReducer from './user-reducer'
import videoReducer from './video-control-reducer'

const reducersCombined = combineReducers({
  userReducer,
  videoReducer
})

export default reducersCombined
