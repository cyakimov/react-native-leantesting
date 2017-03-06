import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import ButtonSelect from '../ButtonSelect'
import BugPriority from '../BugPriority'
import {listPriorities} from '../../utils/bug'
import {connect} from 'react-redux'

@connect()
export default class BugPriorityScreen extends Component {
  static propTypes = {
    selectedId: React.PropTypes.number,
    actionCallback: React.PropTypes.func.isRequired,
  }
  static route = {
    navigationBar: {
      title: 'Priority',
    }
  };

  constructor(props) {
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress(selectedId) {
    const {dispatch} = this.props;
    dispatch(this.props.actionCallback(selectedId))
    setTimeout(() => {
      this.props.navigator.pop();
    }, 50)
  }

  _renderPriorityIcon(id) {
    return (
      <View>
        <BugPriority id={id} style={styles.icon}/>
      </View>
    )
  }

  render() {
    const {selectedId} = this.props

    let list = listPriorities().map((p, index) => {
      return <ButtonSelect checked={selectedId == p.id} key={p.id} text={p.name} onPress={() => {this._onPress(p.id)}}
                           leftIcon={() => {return this._renderPriorityIcon(p.id)}}/>
    })

    return (
      <ScrollView style={{paddingTop: 10}}>
        {list}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
    // paddingVertical: 10
  }
});
