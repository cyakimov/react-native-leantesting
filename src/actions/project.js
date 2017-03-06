import {arrayOf, normalize} from 'normalizr'
import {Schemas} from '../state/Schemas'
import ActionTypes from './ActionTypes';
// import request from '../lib/api'

import {CALL_API} from '../middleware/api'

// Fetches a single repository from LT API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const getProjects = (nextPageUrl) => ({
  [CALL_API]: {
    types: [ActionTypes.FETCH_PROJECTS_REQUEST, ActionTypes.FETCH_PROJECTS_SUCCESS, ActionTypes.FETCH_PROJECTS_FAILURE],
    endpoint: nextPageUrl,
    schema: {projects: Schemas.PROJECT_ARRAY}
  }
});

// Fetches a single repository from LT API unless it is cached.
// Relies on Redux Thunk middleware.
export const fetchProjects = (refresh = false, nextPage = false) => (dispatch, getState) => {
  const endpoint = 'projects?limit=20&include=role,organization,bugTypeScheme,bugStatusScheme,stats';
  let {
    nextPageUrl = endpoint,
    pageCount = 0
  } = getState().pagination.projects.all || {}

  if (!refresh && pageCount > 0 && !nextPage) {
    return null
  }

  if (refresh || !nextPageUrl) {
    nextPageUrl = endpoint
  }

  return dispatch(getProjects(nextPageUrl))
};
