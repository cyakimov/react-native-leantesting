import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux'
import VersionList from '../containers/VersionList'
import ButtonSelect from '../ButtonSelect'

@connect()
export default class ProjectVersionScreen extends Component {
  static propTypes = {
    actionCallback: React.PropTypes.func.isRequired,
  }
  static route = {
    navigationBar: {
      title: 'Version',
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

  _renderRow(version, index) {
    return <ButtonSelect checked={this.props.selectedId == version.id} key={index} text={version.number}
                         onPress={() => {this._onPress(version.id)}}/>
  }

  render() {
    return (
      <View style={styles.container}>
        <VersionList projectId={this.props.projectId} renderRowFunc={this._renderRow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
