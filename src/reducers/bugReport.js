import ActionTypes from '../actions/ActionTypes';

const initialState = {
  title: null,
  description: null,
  expected_results: null,
  projectId: null,
  projectVersionId: null,
  typeId: null,
  statusId: null,
  priorityId: 1,
  severityId: 1,
  projectSectionId: null,
  hasRequiredFields: false,
  isUploading: false,
  bugCreated: false,
  uploadError: false,
  errorMessage: null,
  steps: [],
  files: [],
}

const determineRequiredFields = (state) => {
  const mandatory = ['title', 'projectId', 'projectVersionId', 'statusId', 'severityId']

  for (let field of mandatory) {
    const value = state[field]
    if (value == null || value == '') {
      return false
    }
  }

  return true
}

class BugReport {
  static reduce(state = initialState, action) {
    if (BugReport[action.type]) {
      let _state = BugReport[action.type](state, action)

      _state.hasRequiredFields = determineRequiredFields(_state)
      return _state;
    }
    return state;
  }

  static [ActionTypes.BUG_REPORT_SET_TITLE](state, action) {
    return {
      ...state,
      title: action.title
    }
  }

  static [ActionTypes.BUG_REPORT_SET_DESCRIPTION](state, action) {
    return {
      ...state,
      description: action.description
    }
  }

  static [ActionTypes.BUG_REPORT_SET_EXPECTED_RESULTS](state, action) {
    return {
      ...state,
      expected_results: action.expectedResults
    }
  }

  static [ActionTypes.BUG_REPORT_SET_PRIORITY](state, action) {
    return {
      ...state,
      priorityId: action.priorityId
    }
  }

  static [ActionTypes.BUG_REPORT_SET_SEVERITY](state, action) {
    return {
      ...state,
      severityId: action.severityId
    }
  }

  static [ActionTypes.BUG_REPORT_SET_PROJECT](state, action) {
    return {
      ...state,
      projectId: action.projectId,
      typeId: null,
      statusId: null,
    }
  }

  static [ActionTypes.BUG_REPORT_SET_VERSION](state, action) {
    return {
      ...state,
      projectVersionId: action.versionId
    }
  }

  static [ActionTypes.BUG_REPORT_SET_TYPE](state, action) {
    return {
      ...state,
      typeId: action.typeId
    }
  }

  static [ActionTypes.BUG_REPORT_SET_STATUS](state, action) {
    return {
      ...state,
      statusId: action.statusId
    }
  }

  static [ActionTypes.BUG_REPORT_SET_COMPONENT](state, action) {
    return {
      ...state,
      projectSectionId: action.componentId
    }
  }

  static [ActionTypes.BUG_REPORT_SET_STEPS](state, action) {
    return {
      ...state,
      steps: action.steps
    }
  }

  static [ActionTypes.BUG_REPORT_ADD_FILE](state, action) {
    const {files} = state

    return {
      ...state,
      files: [...files, action.file]
    }
  }


  static [ActionTypes.BUG_REPORT_REMOVE_FILE](state, action) {
    const {fileIndex} = action
    const {files} = state

    return {
      ...state,
      files: files.slice(0, fileIndex).concat(files.slice(fileIndex + 1))
    }
  }

  static [ActionTypes.CREATE_BUG_REQUEST](state, action) {
    return {
      ...state,
      isUploading: true
    }
  }

  static [ActionTypes.CREATE_BUG_SUCCESS](state, action) {
    return {
      ...state,
      bugCreated: true,
      isUploading: false,
    }
  }

  static [ActionTypes.CREATE_BUG_FAILURE](state, action) {
    return {
      ...state,
      isUploading: false,
      uploadError: true,
      errorMessage: action.error,
    }
  }

  static [ActionTypes.SIGN_OUT](state, action) {
    return initialState
  }

  static [ActionTypes.BUG_REPORT_RESET](state, action) {
    return initialState
  }
}

export default BugReport.reduce;
