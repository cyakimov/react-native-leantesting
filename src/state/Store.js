import {createNavigationEnabledStore} from '@exponent/ex-navigation';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import reducers from '../reducers/index'
import api from '../middleware/api'
import createLogger from 'redux-logger'

const createStoreWithNavigation = createNavigationEnabledStore({
  createStore,
  navigationStateKey: 'navigation',
});

const middlewares = [thunk, api];

if (__DEV__) {
  const logger = createLogger();
  middlewares.push(logger);
  console.ignoredYellowBox = ['Warning: You passed a non-serializable value as route parameters.']
}

export const store = createStoreWithNavigation(reducers, applyMiddleware(...middlewares));

export default store;
