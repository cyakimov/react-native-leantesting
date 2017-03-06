import ActionTypes from '../actions/ActionTypes';

const initialState = {
  access_token: null,
  requesting: false,
}

class Auth {
  static reduce(state = initialState, action) {
    if (Auth[action.type]) {
      return Auth[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SIGN_OUT](state, action) {
    return initialState
  }

  static [ActionTypes.SET_AUTH_TOKEN](state, action) {
    return {
      ...state,
      ...action.auth
    }
  }

  static [ActionTypes.AUTH_TOKEN_REQUEST](state, action) {
    return {
      ...state,
      requesting: true,
    }
  }

  static [ActionTypes.AUTH_TOKEN_SUCCESS](state, action) {
    return {
      ...state,
      ...action.response,
      requesting: false,
    }
  }

  static [ActionTypes.AUTH_TOKEN_FAILURE](state, action) {
    return {
      ...state,
      requesting: false,
    }
  }

}

export default Auth.reduce;
