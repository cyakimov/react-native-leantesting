/**
 * @providesModule Alerts
 * @flow
 */

import { StyleSheet } from 'react-native';

export default {
  error: StyleSheet.create({
    container: {
      backgroundColor: 'red',
    },
    text: {
      color: 'white',
    },
  }),
  success: StyleSheet.create({
    container: {
      backgroundColor: 'green',
    },
    text: {
      color: 'white',
    },
  }),
  warning: StyleSheet.create({
    container: {
      backgroundColor: '#EAEB5E',
    },
    text: {
      color: '#666804',
    },
  }),
}
