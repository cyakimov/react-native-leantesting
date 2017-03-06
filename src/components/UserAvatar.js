import React, {Component, PropTypes} from 'react';
import {} from 'react-native';
import {Image} from '@shoutem/ui'

export default class UserAvatar extends Component {
  static propTypes = {
    styleName: PropTypes.string,
  }

  static defaultProps = {
    styleName: 'small-avatar top'
  }

  render() {
    const {styleName, user} = this.props
    return (
      <Image
        styleName={styleName}
        source={{uri: user.avatar}}
      />
    )
  }
}