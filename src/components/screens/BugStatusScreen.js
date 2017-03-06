import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';

import ButtonSelect from '../ButtonSelect'

@connect((state, ownProps) => BugTypeScreen.getStateProps(state, ownProps))
export default class BugTypeScreen extends Component {
  static propTypes = {
    selectedId: React.PropTypes.number,
    projectId: React.PropTypes.number.isRequired,
    actionCallback: React.PropTypes.func.isRequired,
  }
  static route = {
    navigationBar: {
      title: 'Status',
    }
  };

  static getStateProps(state, ownProps) {
    const {entities: {projects, bugStatusScheme}} = state;
    const {projectId} = ownProps

    const scheme = projects[projectId].bugStatusScheme
    const statuses = scheme.map(id => bugStatusScheme[id]);

    return {
      statuses
    }
  }

  constructor(props) {
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress(selectedId) {
    const {dispatch} = this.props;
    dispatch(this.props.actionCallback(selectedId))
    this.props.navigator.pop();
  }


  _renderIcon(status) {
    const color = status.color
    return <Icon name='circle' style={[styles.icon, {color}]}/>
  }

  render() {
    const {selectedId, statuses} = this.props

    let list = statuses.map((s, index) => {
      return <ButtonSelect checked={selectedId == s.id} key={s.id} text={s.name} onPress={() => {this._onPress(s.id)}}
                           leftIcon={() => {return this._renderIcon(s)}}/>
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
    paddingVertical: 10
  }
});
