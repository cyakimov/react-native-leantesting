import ActionTypes from './ActionTypes';
import {Schemas} from '../state/Schemas'
import {CALL_API} from '../middleware/api'

export const reset = () => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_RESET,
  })
};

export const setTitle = (title) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_TITLE,
    title
  })
};

export const setDescription = (description) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_DESCRIPTION,
    description
  })
};

export const setExpectedResults = (expectedResults) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_EXPECTED_RESULTS,
    expectedResults
  })
};

export const setPriority = (priorityId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_PRIORITY,
    priorityId
  })
};

export const setSeverity = (severityId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_SEVERITY,
    severityId
  })
};

export const setProject = (projectId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_PROJECT,
    projectId
  })
};

export const setVersion = (versionId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_VERSION,
    versionId
  })
};

export const setType = (typeId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_TYPE,
    typeId
  })
};

export const setStatus = (statusId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_STATUS,
    statusId
  })
};

export const setSteps = (steps: Array) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_STEPS,
    steps
  })
};

export const setComponent = (componentId) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_SET_COMPONENT,
    componentId
  })
};

export const addFile = (file) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_ADD_FILE,
    file
  })
};

export const removeFile = (fileIndex) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.BUG_REPORT_REMOVE_FILE,
    fileIndex
  })
};

const create = (projectId, data, onUploadProgress) => ({
  projectId,
  [CALL_API]: {
    types: [ActionTypes.CREATE_BUG_REQUEST, ActionTypes.CREATE_BUG_SUCCESS, ActionTypes.CREATE_BUG_FAILURE],
    endpoint: `projects/${projectId}/bugs`,
    data,
    callbacks: {
      onUploadProgress
    },
    method: 'POST',
    schema: Schemas.BUG
  }
})

export const createBug = (projectId: Number, formData: Object, onUploadProgress: Function) => (dispatch, getState) => {
  return dispatch(create(projectId, formData, onUploadProgress))
};