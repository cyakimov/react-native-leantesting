import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default class NavBarButton extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired,
    style: React.PropTypes.any,
    muted: React.PropTypes.bool,
  }

  render() {
    const {muted, onPress} = this.props
    return (
      <TouchableOpacity activeOpacity={muted ? 1 : 0.2} onPress={muted ? () => {} : onPress}>
        <Text style={[styles.button, this.props.style, muted ? styles.disabled : {}]}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: '#fff',
    marginTop: 15,
  },
  disabled: {
    color: '#ccc'
  }
});
