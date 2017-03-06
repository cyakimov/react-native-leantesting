import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {View, Row, Icon, Text, Subtitle, Caption} from '@shoutem/ui'

export default class ButtonSelect extends Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    pressColor: React.PropTypes.string,
    text: React.PropTypes.string.isRequired,
    subText: React.PropTypes.string,
    viewStyle: React.PropTypes.any,
    leftIcon: React.PropTypes.any,
    checkIcon: React.PropTypes.string,
    checkIconStyle: React.PropTypes.any,
    checked: React.PropTypes.bool,
  };

  static defaultProps = {
    subText: null,
    pressColor: '#eeeeee',
    checked: false,
    checkIcon: 'ios-checkmark-circle',
    onPress: () => {
    },
  }

  _renderIcon(icon) {
    if (icon === undefined || icon === null) {
      return null;
    }

    if (typeof icon === 'function') {
      return icon();
    }

    return <Ionicons name={leftIcon} size={20} style={{color: '#2b333f'}}/>
  }

  render() {
    const {text, subText, checked, leftIcon, checkIcon, checkIconStyle, viewStyle, pressColor, onPress} = this.props;
    return (
      <TouchableHighlight underlayColor={pressColor} onPress={onPress} style={styles.touch}>
        <Row>
          {leftIcon && this._renderIcon(leftIcon)}
          <View styleName="vertical">
            {subText ? <Caption>{text}</Caption> : <Subtitle style={StyleSheet.flatten({fontSize: 18, fontWeight: "100"})} numberOfLines={1}>{text}</Subtitle>}
            {subText && <Subtitle numberOfLines={1}>{subText}</Subtitle>}
          </View>
          {checkIcon && checked && <Ionicons name={checkIcon} size={20} style={[styles.checkIcon, checkIconStyle]}/>}
        </Row>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  touch: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  textContainer: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    color: '#030303',
    fontSize: 18,
    // fontWeight: "500",
    fontFamily: 'Quicksand',
  },
  subtext: {
    color: '#656565',
    fontSize: 12,
    marginTop: 4
  },
  iconContainer: {
    // alignSelf: 'center',
    flex: 0,
    width: 30,
    height: 30,
    borderRadius: 3,
    // marginLeft: -10,
    marginRight: 4,
  },
  checkIcon: {
    color: '#00b4ff',
    marginLeft: 4,
    marginRight: 0,
  }
});
