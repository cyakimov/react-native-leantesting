import ActionTypes from '../actions/ActionTypes';
import {Record} from 'immutable';

export const User = Record({
  id: null,
  username: null,
  first_name: null,
  last_name: null,
  avatar: null,
  email: null,
});

class CurrentUserReducer {
  static reduce(state = new User(), action) {
    if (CurrentUserReducer[action.type]) {
      return CurrentUserReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_CURRENT_USER](state, action) {
    let {user} = action;

    if (!user) {
      return new User();
    }
    return new User({
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  }

  static [ActionTypes.FETCH_CURRENT_USER_SUCCESS](state, action) {
    const users = action.response.entities.users
    const id = Object.keys(users)[0]

    return new User({...users[id]});
  }

  // static [ActionTypes.SIGN_OUT](state, action) {
  //   return new User();
  // }
}

export default CurrentUserReducer.reduce;
