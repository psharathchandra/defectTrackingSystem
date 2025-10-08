import { combineReducers } from 'redux'

import authTokenReducer from './authTokenReducer'
import spinnerReducer from './spinnerReducer'

const rootReducer = combineReducers({
  authToken: authTokenReducer,
  spinner:spinnerReducer
})

export default rootReducer