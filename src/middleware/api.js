import {Schema, arrayOf, normalize} from 'normalizr'
import ActionTypes from '../actions/ActionTypes'
import axios from 'axios'

const API_ROOT = 'https://api.leantesting.com/v1/';
// const TOKEN = '<your oauth2 token>';

axios.defaults.baseURL = API_ROOT;
axios.defaults.timeout = 5000;
// axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

type Callbacks = {
  onUploadProgress: () => {},
  onDownloadProgress: () => {},
  cancelToken: (cancel) => {}
}

type RequestConfig = {
  callbacks: Callbacks,
  data: FormData,
  method: "GET" | "POST" | "PUT"| "DELETE",
  responseSchema: Object
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (url: String, config: RequestConfig, token: String) => {
  const {responseSchema = null, data, callbacks, method} = config
  const request = {
      ...callbacks,
    url,
    data,
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  };

  return axios(request)
    .then(response => {
        const json = response.data
        if ([200, 201].indexOf(response.status) === -1) {
          return Promise.reject(json)
        }

        if (responseSchema === null) {
          return json
        }

        const nextPageUrl = getNextPageUrl(json)
        return Object.assign({}, normalize(json, responseSchema), {nextPageUrl})
      }
    )
};

// Extracts the next page URL from LT API response.
const getNextPageUrl = json => {
  if (!json.hasOwnProperty('meta')) {
    return null;
  }

  const {meta} = json;

  if (!meta.hasOwnProperty('pagination')) {
    return null;
  }

  if (meta.pagination.current_page >= meta.pagination.total_pages) {
    return null;
  }

  return meta.pagination.links.next || undefined;
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = "Call API"

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let {endpoint} = callAPI
  const {schema, types, method = 'GET', data, callbacks} = callAPI
  const {auth: {access_token} = {}} = store.getState();

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!data && !schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({type: ActionTypes.NETWORK_OPERATION_START}));
  next(actionWith({type: requestType}));

  const config = {responseSchema: schema, data, callbacks, method}
  return callApi(endpoint, config, access_token).then(
    response => {
      next(actionWith({
        response,
        type: successType
      }))
      next(actionWith({type: ActionTypes.NETWORK_OPERATION_END}))
    },
    error => {
      next(actionWith({
        type: failureType,
        error: error.message || 'Something bad happened'
      }))
      next(actionWith({type: ActionTypes.NETWORK_OPERATION_END}))
    }
  )
}
