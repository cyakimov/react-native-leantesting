import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {withNavigation} from '@exponent/ex-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

@withNavigation
export default class SlimView extends Component {
  static propTypes = {
    onPress: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress() {
    const {onPress} = this.props

    if (typeof onPress === 'function') {
      return onPress();
    }

    this.props.navigator.pop();
  }

  render() {
    const {onPress} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.Button
            activeOpacity={0.2}
            name="ios-close"
            size={35}
            backgroundColor="transparent"
            color="#1EA2FF"
            style={styles.icon}
            iconStyle={styles.icon}
            onPress={this._onPress}
          />
        </View>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  header: {
    paddingHorizontal: 2
  },
  button: {},
  icon: {
    marginLeft: 2,
  }
})
