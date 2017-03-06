import React, {Component} from 'react';
import {
  Animated,
  Easing
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';

export default class RefreshingIcon extends Component {
  _animatedValue = new Animated.Value(0)

  constructor(props) {
    super(props)
    this.cycleAnimation = this.cycleAnimation.bind(this)
  }

  componentDidMount() {
    this.cycleAnimation()
  }

  cycleAnimation() {
    this._animatedValue.setValue(0)
    Animated.timing(this._animatedValue, {
      toValue: 40000,
      duration: 320000,
      easing: Easing.linear
    }).start(this.cycleAnimation);
  }

  render() {
    let interpolatedRotateAnimation = this._animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '360deg']
    });

    return (
      <Animated.View style={{transform: [{rotate: interpolatedRotateAnimation}]}}>
        <FAIcon name="refresh"/>
      </Animated.View>
    )
  }
}