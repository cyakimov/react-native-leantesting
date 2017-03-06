import ActionTypes from '../actions/ActionTypes';

const initialState = false

class NetworkActivityIndicator {
  static reduce(state = initialState, action) {
    if (NetworkActivityIndicator[action.type]) {
      return NetworkActivityIndicator[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.NETWORK_OPERATION_START](state, action) {
    return true
  }

  static [ActionTypes.SIGN_OUT](state, action) {
    return initialState
  }

  static [ActionTypes.NETWORK_OPERATION_END](state, action) {
    return false
  }

}

export default NetworkActivityIndicator.reduce;
