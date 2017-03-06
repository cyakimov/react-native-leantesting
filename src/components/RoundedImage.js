import React, {Component} from 'react';
import ReactNative from 'react-native';

const {
        Image
      } = ReactNative;

export default class RoundedImage extends Component {
  static propTypes = {
    uri: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    size: 30,
    style: {
      borderWidth: 0.5,
      borderColor: '#333',
      padding: 2
    }
  };

  render() {
    const {size, uri, style} = this.props
    const radius = size / 2;
    const _sizeStyle = {height: size, width: size, borderRadius: radius};
    return (
      <Image style={[style, _sizeStyle]} source={{uri: uri}}/>
    )
  }
}