import {arrayOf, normalize} from 'normalizr'
import {Schemas} from '../state/Schemas'
import ActionTypes from './ActionTypes';
import {CALL_API} from '../middleware/api'
import LocalStorage from '../state/LocalStorage'
import CookieManager from 'react-native-cookies'

// Fetches a single repository from LT API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const getUser = (url) => ({
  [CALL_API]: {
    types: [ActionTypes.FETCH_CURRENT_USER, ActionTypes.FETCH_CURRENT_USER_SUCCESS, ActionTypes.FETCH_CURRENT_USER_FAILURE],
    endpoint: url,
    schema: Schemas.USER
  }
});

// Fetches a single repository from LT API unless it is cached.
// Relies on Redux Thunk middleware.
export const fetchUser = () => (dispatch, getState) => {
  return dispatch(getUser("me"))
};

export const setUser = (user: Object) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_CURRENT_USER,
    user
  })
}

export const signOut = () => (dispatch, getState) => {
  LocalStorage.clearAll();
  // Cookie.clear('https://app.leantesting.com/')
  CookieManager.clearAll((err, res) => {
    console.log(err, res);
  })

  return dispatch({
    type: ActionTypes.SIGN_OUT,
  })
}


