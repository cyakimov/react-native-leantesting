import React, {Component} from 'react';
import {
  ProgressViewIOS,
  ProgressBarAndroid,
  Platform,
} from 'react-native';

export default class ProgressBar extends Component {
  static propTypes = {
    progress: React.PropTypes.number,
    progressTintColor: React.PropTypes.string,
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid styleAttr="Horizontal" progress={this.props.progress} indeterminate={false} />
      )
    }

    return (
      <ProgressViewIOS progress={this.props.progress} progressTintColor={this.props.progressTintColor} />
    )
  }
}