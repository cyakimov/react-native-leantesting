import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
} from 'react-native';

export default class LoadingScreen extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
        <ActivityIndicator
          animating={true}
          style={[styles.indicator]}
          size="small"
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 96,
    width: 96
  },
  indicator: {
    marginTop: 40
  },
})
