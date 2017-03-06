import ActionTypes from './ActionTypes';
import {CALL_API} from '../middleware/api'
import {OAUTH, OAUTH_TOKEN_URI} from '../state/Constants'

// Fetches a single repository from LT API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const getToken = (code) => ({
  [CALL_API]: {
    types: [ActionTypes.AUTH_TOKEN_REQUEST, ActionTypes.AUTH_TOKEN_SUCCESS, ActionTypes.AUTH_TOKEN_FAILURE],
    endpoint: OAUTH_TOKEN_URI,
    method: 'POST',
    data: {
      ...OAUTH,
      code
    }
  }
});

// Fetches a single repository from LT API unless it is cached.
// Relies on Redux Thunk middleware.
export const requestToken = (code) => (dispatch, getState) => {
  return dispatch(getToken(code))
};

export const setAuth = (auth: Object) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_AUTH_TOKEN,
    auth
  })
}
