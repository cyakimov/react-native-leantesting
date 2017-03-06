import {arrayOf, normalize} from 'normalizr'
import {Schemas} from '../state/Schemas'
import ActionTypes from './ActionTypes';

import {CALL_API} from '../middleware/api'

// Fetches a single repository from LT API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const getComponents = (projectId, nextPageUrl) => ({
  projectId,
  [CALL_API]: {
    types: [ActionTypes.FETCH_COMPONENTS_REQUEST, ActionTypes.FETCH_COMPONENTS_SUCCESS, ActionTypes.FETCH_COMPONENTS_FAILURE],
    endpoint: nextPageUrl,
    schema: {sections: Schemas.COMPONENT_ARRAY}
  }
});

// Fetches a single repository from LT API unless it is cached.
// Relies on Redux Thunk middleware.
export const fetchComponents = (projectId, nextPage) => (dispatch, getState) => {
  const {
    nextPageUrl = `projects/${projectId}/components?limit=100`,
    pageCount = 0
  } = getState().pagination.componentsByProject[projectId] || {}

  if (pageCount > 0 && !nextPage) {
    return null
  }

  return dispatch(getComponents(projectId, nextPageUrl))
};
