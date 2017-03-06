import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {NavigationStyles, StackNavigation} from '@exponent/ex-navigation';
import Router from '../../Router'

export default class ReportBugScreen extends Component {
  static route = {
    styles: {
      ...NavigationStyles.SlideVertical,
      gestures: null,
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <StackNavigation
          id="report"
          initialRoute={Router.getRoute('bugForm')}
          defaultRouteConfig={{
            navigationBar: {
              backgroundColor: '#FFF',//4B89FB
              tintColor: '#4D5C66',//fff
            }
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
