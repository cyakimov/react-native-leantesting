import {arrayOf, normalize} from 'normalizr'
import {Schemas} from '../state/Schemas'
import ActionTypes from './ActionTypes';

import {CALL_API} from '../middleware/api'

// Fetches a single repository from LT API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const getOrganizations = (nextPageUrl) => ({
  [CALL_API]: {
    types: [ActionTypes.FETCH_ORGS_REQUEST, ActionTypes.FETCH_ORGS_SUCCESS, ActionTypes.FETCH_ORGS_FAILURE],
    endpoint: nextPageUrl,
    schema: {organizations: Schemas.ORGANIZATION_ARRAY}
  }
});

// Fetches a single repository from LT API unless it is cached.
// Relies on Redux Thunk middleware.
export const fetchOrganizations = (nextPage) => (dispatch, getState) => {
  const {
    nextPageUrl = 'me/organizations?limit=20&include=role',
    pageCount = 0
  } = getState().pagination.organizations.all || {}

  if (pageCount > 0 && !nextPage) {
    return null
  }

  return dispatch(getOrganizations(nextPageUrl))
};
