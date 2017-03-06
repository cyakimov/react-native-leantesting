import {combineReducers} from 'redux'
import {NavigationReducer} from '@exponent/ex-navigation';
import currentUser from './currentUser'
import paginate from './paginate'
import ActionTypes from '../actions/ActionTypes'
import entities from './entities'
import bugReport from './bugReport'
import auth from './auth'
import networkActivityIndicatorVisible from './networkActivityIndicator'


// Updates the pagination data for different actions.
const pagination = combineReducers({
  projects: paginate({
    mapActionToKey: action => 'all',
    indexKey: 'projects',
    types: [
      ActionTypes.FETCH_PROJECTS_REQUEST,
      ActionTypes.FETCH_PROJECTS_SUCCESS,
      ActionTypes.FETCH_PROJECTS_FAILURE
    ]
  }),
  organizations: paginate({
    mapActionToKey: action => 'all',
    indexKey: 'organizations',
    types: [
      ActionTypes.FETCH_ORGS_REQUEST,
      ActionTypes.FETCH_ORGS_SUCCESS,
      ActionTypes.FETCH_ORGS_FAILURE
    ]
  }),
  users: paginate({
    mapActionToKey: action => `${action.userId}`,
    indexKey: 'users',
    types: [
      ActionTypes.FETCH_ORGS_REQUEST,
      ActionTypes.FETCH_ORGS_SUCCESS,
      ActionTypes.FETCH_ORGS_FAILURE
    ]
  }),
  bug: paginate({
    mapActionToKey: action => `${action.bugId}`,
    types: [
      ActionTypes.FETCH_BUG_REQUEST,
      ActionTypes.FETCH_BUG_SUCCESS,
      ActionTypes.FETCH_BUG_FAILURE
    ]
  }),
  bugsByProject: paginate({
    mapActionToKey: action => `${action.projectId}`,
    indexKey: 'bugs',
    types: [
      ActionTypes.FETCH_BUGS_REQUEST,
      ActionTypes.FETCH_BUGS_SUCCESS,
      ActionTypes.FETCH_BUGS_FAILURE
    ]
  }),
  componentsByProject: paginate({
    mapActionToKey: action => `${action.projectId}`,
    indexKey: 'sections',
    types: [
      ActionTypes.FETCH_COMPONENTS_REQUEST,
      ActionTypes.FETCH_COMPONENTS_SUCCESS,
      ActionTypes.FETCH_COMPONENTS_FAILURE
    ]
  }),
  versionsByProject: paginate({
    mapActionToKey: action => `${action.projectId}`,
    indexKey: 'versions',
    types: [
      ActionTypes.FETCH_VERSIONS_REQUEST,
      ActionTypes.FETCH_VERSIONS_SUCCESS,
      ActionTypes.FETCH_VERSIONS_FAILURE
    ]
  }),
});

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const {type, error} = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

const rootReducer = combineReducers({
  navigation: NavigationReducer,
  networkActivityIndicatorVisible,
  entities,
  pagination,
  currentUser,
  errorMessage,
  bugReport,
  auth,
});

export default rootReducer;
