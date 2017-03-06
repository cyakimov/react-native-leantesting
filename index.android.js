/**
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AppContainer from './src/components/containers/AppContainer'

export default class leantesting extends Component {
  render() {
    return <AppContainer />;
  }
}

AppRegistry.registerComponent('leantesting', () => leantesting);
