/**
 * @providesModule LocalStorage
 * @flow
 */

import { AsyncStorage } from 'react-native';

const Keys = {
  User: 'User',
  Auth: 'Auth'
};

async function getUserAsync() {
  const results = await AsyncStorage.getItem(Keys.User);

  try {
    return JSON.parse(results);
  } catch(e) {
    return null;
  }
}

async function getAuthAsync() {
  const results = await AsyncStorage.getItem(Keys.Auth);

  try {
    return JSON.parse(results);
  } catch(e) {
    return null;
  }
}

async function saveAuthAsync(auth: Object) {
  return AsyncStorage.setItem(Keys.Auth, JSON.stringify(auth));
}

async function saveUserAsync(user: Object) {
  return AsyncStorage.setItem(Keys.User, JSON.stringify(user));
}

async function removeUserAsync() {
  return AsyncStorage.removeItem(Keys.User);
}

async function clearAll() {
  return AsyncStorage.clear();
}

export default {
  saveAuthAsync,
  saveUserAsync,
  getUserAsync,
  getAuthAsync,
  removeUserAsync,
  clearAll,
};
