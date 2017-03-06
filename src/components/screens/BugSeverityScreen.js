import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux'

import ButtonSelect from '../ButtonSelect'
import BugSeverity from '../BugSeverity'
import {listSeverities} from '../../utils/bug'

@connect()
export default class BugSeverityScreen extends Component {
  static propTypes = {
    selectedId: React.PropTypes.number,
    actionCallback: React.PropTypes.func.isRequired,
  }
  static route = {
    navigationBar: {
      title: 'Severity',
    }
  };

  constructor(props) {
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress(selectedId) {
    const {dispatch} = this.props;
    dispatch(this.props.actionCallback(selectedId))
    this.props.navigator.pop();
  }

  _renderIcon(id) {
    return (
      <View>
        <BugSeverity id={id} style={styles.icon}/>
      </View>
    )
  }

  render() {
    const {selectedId} = this.props

    let list = listSeverities().map((p, index) => {
      return <ButtonSelect checked={selectedId == p.id} key={p.id} text={p.name} onPress={() => {this._onPress(p.id)}}
                           leftIcon={() => {return this._renderIcon(p.id)}}/>
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
  }
});
