import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Image,
  View,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import {isImage} from '../utils/file'
import {Lightbox, Video, Button, Icon} from '@shoutem/ui'

type File = {
  id: number,
  name: string,
  url: string,
  width: number,
  height: number,
}

type Props = {
  file: File,
  style: Object,
  onPressRemove: () => void,
  hideRemove: Boolean
}

export default class Attachment extends Component {
  props: Props
  unmounting: Boolean = false
  isImage: Boolean

  constructor(props) {
    super(props)
    this.state = {
      loading: isImage(props.file.url),
    }
    this.isImage = isImage(this.props.file.url);
    this.onRemove = this.onRemove.bind(this)
  }

  componentWillUnmount() {
    this.unmounting = true
  }

  componentDidMount() {
    if (this.isImage) {
      Image.getSize(this.props.file.url, (width, height) => {
        if (this.unmounting === false) {
          this.setState({width, height, loading: false})
        }
      })
    }
  }

  onRemove() {
    this.props.onPressRemove()
  }

  renderFile() {
    const {file} = this.props;
    const {loading = true} = this.state

    if (loading) {
      return null;
    }

    if (!isImage(file.url)) {
      return (
        <Video
          source={{uri: file.url}}
          width={120}
          height={120}
          style={{container: {width: 120, height: 120}}}
        />
      )
    }

    const {width, height} = this.state
    const targetWidth = 120.0;
    const multiplier = targetWidth / width;
    const targetHeight = multiplier * height;

    return (
      <Lightbox activeProps={{style: {flex: 1}, resizeMode: 'contain'}}>
        <Image
          source={{uri: file.url}}
          style={[{width: targetWidth, height: targetHeight}]}/>
      </Lightbox>
    )
  }

  render() {
    // const {loading = true} = this.state

    // if (loading) {
    //   return null;
    // }

    const {style = {}, hideRemove} = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.container, style]}>
          {this.renderFile()}
        </View>
        {!hideRemove &&
        <Button styleName="clear" style={{position: 'absolute', top: 0, right: 0}} onPress={this.onRemove}>
          <Ionic name='ios-close-circle' color="black" size={20}/>
        </Button>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 10,
    paddingRight: 10
  },
  container: {
    backgroundColor: '#eff1f4',
    borderWidth: 1,
    borderColor: '#eff1f4',
    justifyContent: 'center',
    borderRadius: 8,
    width: 120,
    height: 80,
    overflow: 'hidden',
  },
  btnRemove: {
    alignSelf: 'flex-end',
  },
  btnRemoveIcon: {
    marginRight: -4,
    marginTop: -10,
  }
});
