import React, {Component} from 'react'
import ReactNative from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const {
  View,
  StyleSheet,
} = ReactNative;

export default class BugStatus extends Component {
  static propTypes = {
    color: React.PropTypes.string.isRequired,
    iconSize: React.PropTypes.number,
    style: React.PropTypes.number,
  }
  static defaultProps = {
    iconSize: 15,
  };

  render() {
    const {iconSize, style, color = '#000'} = this.props;

    return (
      <View style={[styles.iconContainer, {width: iconSize}, style]}>
        <Icon name='circle' style={{fontSize: iconSize, color}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  }
});
