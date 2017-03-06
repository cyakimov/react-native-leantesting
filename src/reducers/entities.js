import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import _ from 'lodash'
import ActionTypes from '../actions/ActionTypes'

const initialState = {
  users: {},
  projects: {},
  bugs: {},
  comments: {},
  organizations: {},
  components: {},
  versions: {},
  bugSeverity: {
    1: {name: 'Minor', order: 2},
    2: {name: 'Major', order: 3},
    3: {name: 'Critical', order: 4},
    4: {name: 'Trivial', order: 1},
  }
};

//http://redux.js.org/docs/advanced/AsyncActions.html#note-on-nested-entities

// Updates an entity cache in response to any action with response.entities.
export const entities = (state = initialState, action) => {
  if (action.response && action.response.entities) {
    let entities = action.response.entities;

    //merge lazy loaded entities into 'projects'
    switch (action.type) {
      case ActionTypes.SIGN_OUT:
        return initialState;
      //add more action types as needed
      case ActionTypes.FETCH_COMPONENTS_SUCCESS:
        const relationKey = Object.keys(entities)[0]
        const relationIds = Object.keys(entities[relationKey]).map(id => parseInt(id))
        return merge({}, state, entities, {
          projects: {
            [action.projectId]: {
              [relationKey]: relationIds
            }
          }
        })
    }

    return mergeWith({}, state, entities, (objVal, newVal) => {
      if (_.isArray(objVal)) {
        return newVal
      }
    })
  }

  return state
};

export default entities
