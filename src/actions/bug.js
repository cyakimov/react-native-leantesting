import {arrayOf, normalize} from 'normalizr'
import {Schemas} from '../state/Schemas'
import ActionTypes from './ActionTypes';

import {CALL_API} from '../middleware/api'

// Relies on the custom API middleware defined in ../middleware/api.js.

const getBugs = (projectId, nextPageUrl) => ({
  projectId,
  [CALL_API]: {
    types: [ActionTypes.FETCH_BUGS_REQUEST, ActionTypes.FETCH_BUGS_SUCCESS, ActionTypes.FETCH_BUGS_FAILURE],
    endpoint: nextPageUrl,
    schema: {bugs: Schemas.BUG_ARRAY}
  }
});

const getBug = (bugId, projectId) => ({
  projectId,
  bugId,
  [CALL_API]: {
    types: [ActionTypes.FETCH_BUG_REQUEST, ActionTypes.FETCH_BUG_SUCCESS, ActionTypes.FETCH_BUG_FAILURE],
    endpoint: `bugs/${bugId}?include=attachments,comments.owner,steps,component,reporter,assignedUser,status,type,version`,
    schema: Schemas.BUG
  }
});

// Relies on Redux Thunk middleware.
export const fetchBugs = (projectId, nextPage = false, refresh = false) => (dispatch, getState) => {
  const endpoint = `projects/${projectId}/bugs?select=title,priority_id`
  let {nextPageUrl = endpoint, pageCount = 0} = getState().pagination.bugsByProject[projectId] || {}

  if (!refresh && pageCount > 0 && !nextPage) {
    return null
  }

  if (refresh || !nextPageUrl) {
    nextPageUrl = endpoint
  }

  return dispatch(getBugs(projectId, nextPageUrl))
};

// Fetches a single bug from LT API unless it is cached.
export const fetchBug = (bugId: Number, projectId: Number, requiredFields: Array = [], force: Boolean = false) => (dispatch, getState) => {
  const bug = getState().entities.bugs[bugId]
  if (!force && bug && requiredFields.every(key => bug.hasOwnProperty(key))) {
    return null
  }

  return dispatch(getBug(bugId, projectId))
}

const update = (bugId, data) => ({
  bugId,
  [CALL_API]: {
    types: [ActionTypes.UPDATE_BUG_REQUEST, ActionTypes.UPDATE_BUG_SUCCESS, ActionTypes.UPDATE_BUG_FAILURE],
    endpoint: `bugs/${bugId}`,
    data,
    method: 'PUT',
    schema: Schemas.BUG
  }
})

export const updateBug = (bugId: Number, fields: Object) => (dispatch, getState) => {
  return dispatch(update(bugId, fields))
};

