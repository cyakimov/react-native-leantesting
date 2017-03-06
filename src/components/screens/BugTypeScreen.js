import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux'

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
      title: 'Type',
    }
  };

  static getStateProps(state, ownProps) {
    const {
      entities: {projects, bugTypeScheme}
    } = state;
    const {projectId,} = ownProps

    const scheme = projects[projectId].bugTypeScheme
    const types = scheme.map(id => bugTypeScheme[id]);

    return {
      types
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

  render() {
    const {selectedId, types} = this.props

    let list = types.map((p, index) => {
      return <ButtonSelect checked={selectedId == p.id} key={p.id} text={p.name} onPress={() => {this._onPress(p.id)}}/>
    })

    return (
      <ScrollView style={{paddingTop: 10}}>
        {list}
      </ScrollView>
    )
  }
}
