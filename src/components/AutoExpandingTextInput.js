import React, {Component} from 'react';
import {
  TextInput,
  StyleSheet
} from 'react-native';

type Props = {
  text: String,
  maxHeight: number,
  onChangeText: Function,
  style: number
}

export default class AutoExpandingTextInput extends Component {
  state: any;
  props: Props

  static defaultProps = {
    maxHeight: 86,
    initialHeight: 0,
    onChangeText: () => {
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      text: props.value,
      height: props.initialHeight,
    }
    this.onChangeText = this.onChangeText.bind(this)
  }

  clear() {
    this.setState({text: null})
  }

  onChangeText(text) {
    this.setState({text});
    this.props.onChangeText(text)
  }

  render() {
    const {maxHeight, style} = this.props
    const currentHeight = Math.max(34, this.state.height)
    const height = currentHeight > maxHeight ? maxHeight : currentHeight
    return (
      <TextInput
        underlineColorAndroid="transparent"
        {...this.props}
        multiline={true}
        onChangeText={this.onChangeText}
        onContentSizeChange={(event) => {
          this.setState({height: event.nativeEvent.contentSize.height});
        }}
        style={[styles.default, {height}, style]}
        value={this.state.text}
      />
    );
  }
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 15,
    paddingVertical: 4,
    paddingLeft: 10,
  }
})