import {arrayOf, normalize} from 'normalizr'
import {Schemas} from '../state/Schemas'
import ActionTypes from './ActionTypes';

import {CALL_API} from '../middleware/api'

// Fetches a single repository from LT API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const getVersions = (projectId, nextPageUrl) => ({
  projectId,
  [CALL_API]: {
    types: [ActionTypes.FETCH_VERSIONS_REQUEST, ActionTypes.FETCH_VERSIONS_SUCCESS, ActionTypes.FETCH_VERSIONS_FAILURE],
    endpoint: nextPageUrl,
    schema: {versions: Schemas.VERSION_ARRAY}
  }
});

// Fetches a single repository from LT API unless it is cached.
// Relies on Redux Thunk middleware.
export const fetchVersions = (projectId, nextPage) => (dispatch, getState) => {
  const {
          nextPageUrl = `projects/${projectId}/versions?limit=100`,
          pageCount = 0
        } = getState().pagination.componentsByProject[projectId] || {}

  if (pageCount > 0 && !nextPage) {
    return null
  }

  return dispatch(getVersions(projectId, nextPageUrl))
};
