import React, {Component} from 'react';

import {
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {View, Row, Icon, Text, Subtitle, Caption} from '@shoutem/ui'

export default class ButtonNavigate extends Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    pressColor: React.PropTypes.string,
    text: React.PropTypes.string.isRequired,
    subText: React.PropTypes.string,
    style: React.PropTypes.any,
    leftIcon: React.PropTypes.any,
    middleIcon: React.PropTypes.any,
    rightIcon: React.PropTypes.any,
    checkStyle: React.PropTypes.any,
    disabled: React.PropTypes.bool,
    containerStyle: React.PropTypes.any,
    biggerSubText: React.PropTypes.bool
  };

  static defaultProps = {
    subText: null,
    rightIcon: 'right-arrow',
    disabled: false,
    pressColor: '#eeeeee',
    biggerSubText: true,
    onPress: () => {},
  }

  _renderIcon(icon) {
    if (icon === undefined || icon === null) {
      return null;
    }

    if (typeof icon === 'function') {
      return icon();
    }

    return <Icon styleName="disclosure" name={icon}/>
  }

  _renderBody() {
    const {biggerSubText, text, subText, leftIcon, middleIcon, rightIcon, containerStyle} = this.props;

    if (biggerSubText) {
      var content = (
        <View styleName="vertical">
          {subText ? <Caption style={StyleSheet.flatten(styles.subText)}>{text}</Caption> : <Subtitle numberOfLines={1}>{text}</Subtitle>}
          {subText && <Subtitle numberOfLines={1}>{subText}</Subtitle>}
        </View>
      );
    } else {
      var content = (
        <View styleName="vertical">
          {<Subtitle numberOfLines={1}>{text}</Subtitle>}
          {subText && <Caption numberOfLines={1}>{subText}</Caption>}
        </View>
      );
    }

    return (
      <Row style={StyleSheet.flatten(containerStyle)}>
        {leftIcon && this._renderIcon(leftIcon)}
        {content}
        {middleIcon && this._renderIcon(middleIcon)}
        {rightIcon && this._renderIcon(rightIcon)}
      </Row>
    )
  }

  render() {
    const {disabled, pressColor, onPress} = this.props;

    if (disabled) {
      return (
        <View style={StyleSheet.flatten([styles.touch, styles.muted])}>
          {this._renderBody()}
        </View>
      )
    }

    return (
      <TouchableHighlight underlayColor={pressColor} onPress={onPress} style={styles.touch}>
        {this._renderBody()}
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  touch: {
    flex: 1,
  },
  muted: {
    opacity: 0.3
  },
  subText: {
    color: '#9D9D9D'
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#030303',
    fontWeight: "500"
  },
  disabledText: {
    color: '#ccc',
  },
  subtext: {
    color: '#656565',
    fontSize: 12,
    marginTop: 4
  },
  iconContainer: {
    // flex: 1,
    // justifyContent: 'center'
  },
  rightIcon: {
    color: '#757575',
  },
});
