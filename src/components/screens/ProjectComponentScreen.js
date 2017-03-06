import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux'
import ComponentList from '../containers/ComponentList'
import ButtonSelect from '../ButtonSelect'

@connect()
export default class ProjectComponentScreen extends Component {
  static propTypes = {
    actionCallback: React.PropTypes.func.isRequired,
  }
  static route = {
    navigationBar: {
      title: 'Component',
    }
  };

  constructor(props) {
    super(props)
    this._onPress = this._onPress.bind(this)
    this._renderRow = this._renderRow.bind(this)
  }

  _onPress(selectedId) {
    const {dispatch} = this.props;
    dispatch(this.props.actionCallback(selectedId))
    setTimeout(() => {
      this.props.navigator.pop();
    }, 50)
  }

  _renderRow(component, index) {
    return <ButtonSelect checked={this.props.selectedId == component.id} key={index} text={component.name}
                         onPress={() => {this._onPress(component.id)}}/>
  }

  render() {
    return (
      <View style={styles.container}>
        <ComponentList projectId={this.props.projectId} renderRowFunc={this._renderRow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
