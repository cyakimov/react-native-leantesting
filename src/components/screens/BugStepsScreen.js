import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux'
import Ionic from 'react-native-vector-icons/Ionicons';
import SortableListView from 'react-native-sortable-listview';
import Utils from '../../lib/utils'
import _ from 'lodash'
import AutoExpandingTextInput from '../AutoExpandingTextInput'

const MAX_LENGTH = 2000;

//@todo CLEANUP THIS SCREEN
class ListViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      index: this.props.index,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      data: props.data,
      index: props.index,
      editable: false,
    })
  }

  render() {
    const {data, editable} = this.state

    // if (!editable) {
    //   return (
    //     <View style={styles.stepContainer}>
    //       <Text style={[styles.input, styles.inputStep]}>{data}</Text>
    //     </View>
    //   )
    // }

    return (
      <View style={styles.stepContainer}>
        <AutoExpandingTextInput
          maxLength={MAX_LENGTH}
          maxHeight={160}
          style={[styles.input, styles.inputStep]}
          value={data}
          onChangeText={this.props.onChangeText}/>
        <Ionic.Button
          activeOpacity={0.2}
          name="ios-move"
          size={22}
          backgroundColor="transparent"
          color="black"
          style={styles.button}
          iconStyle={styles.icon}
          delayLongPress={300}
          {...this.props.sortHandlers}
        />
        <Ionic.Button
          activeOpacity={0.2}
          name="ios-remove-circle"
          size={24}
          backgroundColor="transparent"
          color="red"
          style={styles.button}
          iconStyle={styles.icon}
          onPress={this.props.onPress}
        />
      </View>
    )
  }
}

@connect()
export default class BugStepsScreen extends Component {
  static propTypes = {
    steps: React.PropTypes.arrayOf(String),
    actionCallback: React.PropTypes.func,
  }
  static route = {
    navigationBar: {
      title: 'Steps to reproduce',
    }
  };

  order: Array

  constructor(props) {
    super(props)
    this.state = {
      steps: props.steps,
      updated: false,
    }
    this.order = Object.keys(this.state.steps)
    this.onPressAdd = this.onPressAdd.bind(this)
    this.onPressRemove = this.onPressRemove.bind(this)
    this.moveOrderItem = this.moveOrderItem.bind(this)
    this.updateStep = this.updateStep.bind(this)
    // this.renderRow = this.renderRow.bind(this)
  }

  componentWillUnmount() {
    if (this.state.updated) {
      const {dispatch} = this.props;
      dispatch(this.props.actionCallback(this.getSortedSteps()))
    }
  }

  onPressAdd() {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const value = this.state.text

    if (!value || _.isEmpty(value.trim())) {
      return;
    }

    const steps = this.state.steps
    const newKey = `p${Object.keys(steps).length + 1}`
    this.order.push(newKey)

    this.refs.input.clear()

    this.setState({
      steps: {...steps, [newKey]: value},
      updated: true,
      text: null
    })
  }

  onPressRemove(index) {
    LayoutAnimation.easeInEaseOut()
    const {steps} = this.state
    this.order = this.order.filter(o => o != index)
    this.setState({
      steps: _.omit(steps, index),
      updated: true,
    })
  }

  updateStep(text, index) {
    const {steps} = this.state

    let updated = {...steps}
    updated[index] = text

    this.setState({
      steps: updated,
      updated: true,
    })
  }

  moveOrderItem(e) {
    Utils.move(this.order, parseInt(e.from), parseInt(e.to));
    if (this.refs.listView.forceUpdate) {
      this.refs.listView.forceUpdate()
      this.setState({updated: true})
    }
  }

  getSortedSteps() {
    const {steps} = this.state
    const order = this.order
    let result = [];
    for (let i = 0; i < order.length; i++) {
      result[i] = steps[order[i]];
    }
    return result;
  }

  render() {
    const {steps, text} = this.state

    // const Container = Platform.OS === 'ios' ? <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={65}/> : <View/>;

    const Container = Platform.select({
      ios: () => KeyboardAvoidingView,
      android: () => View,
    })();

    return (
      <Container style={{flex: 1}} behavior="padding" keyboardVerticalOffset={65}>
        <SortableListView
          ref='listView'
          style={{flex: 1, marginTop: 0}}
          data={steps}
          order={this.order}
          onRowMoved={this.moveOrderItem}
          renderRow={(dataItem, section, index) => <ListViewItem onChangeText={(text) => this.updateStep(text, index)} data={dataItem} onPress={() => this.onPressRemove(index)} />}
        />
        <View style={styles.inputContainer}>
          <AutoExpandingTextInput
            disableFullscreenUI={true}
            maxLength={MAX_LENGTH}
            ref='input'
            clearButtonMode="while-editing"
            returnKeyType="done"
            onChangeText={(text) => {
              this.setState({text});
            }}
            value={text}
            onSubmitEditing={this.onPressAdd}
            numberOfLines={1}
            style={[styles.input, styles.inputAdd]}
            placeholder="Add a step"/>
          <Ionic.Button
            activeOpacity={0.2}
            name="ios-add-circle"
            size={30}
            backgroundColor="transparent"
            color="#4ACB7D"
            style={[styles.button, styles.buttonAdd]}
            iconStyle={styles.icon}
            onPress={this.onPressAdd}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingVertical: 6,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 10
  },
  inputAdd: {
    fontSize: 15,
  },
  inputStep: {
    fontSize: 15,
  },
  button: {
    padding: 0,
    paddingLeft: 10,
  },
  buttonAdd: {},
  icon: {},
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingLeft: 10
  },
  numberContainer: {
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
  },
});
