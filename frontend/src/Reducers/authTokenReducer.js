function authTokenReducer(state = {}, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case 'SETAUTHTOKEN':
      console.log("in reducer setauthtoken")
      console.log(action.data);
      return action.data
 

    // Do something here based on the different types of actions
    default:
      console.log("in reducer default")
      return state
  }
}
export default authTokenReducer;