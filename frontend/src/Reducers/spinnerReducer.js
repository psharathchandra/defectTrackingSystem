function spinnerReducer(state  ={display:false}, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      case 'SETSPINNER':
        console.log("in reducer setSpinner")
        console.log(action.data);
        return action.data
   
  
      // Do something here based on the different types of actions
      default:
        console.log("in reducer default")
        return state
    }
  }
  export default spinnerReducer;