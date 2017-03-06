import React, {Component} from 'react';
import {connect} from 'react-redux'
import {ScrollView, RefreshControl, StyleSheet, InteractionManager} from 'react-native';
import {withNavigation} from '@exponent/ex-navigation';
import ListItem from '../ListItem'
import {fetchVersions} from '../../actions/version'

@withNavigation
@connect((state, ownProps) => VersionList.getStateProps(state, ownProps))
export default class VersionList extends Component {
  static propTypes = {
    renderRowFunc: React.PropTypes.func,
    projectId: React.PropTypes.number.isRequired,
    onPress: React.PropTypes.func,
  }
  static defaultProps = {
    isFetching: true,
  };

  static getStateProps(state, ownProps) {
    const {
            pagination,
            entities: {versions}
          } = state;

    const versionsPagination = pagination.versionsByProject[ownProps.projectId] || {ids: []};
    const versionArray = versionsPagination.ids.map(id => versions[id]);
    const {isFetching = true}= versionsPagination;

    return {
      versionArray,
      versionsPagination,
      isFetching,
    }
  }

  constructor(props) {
    super(props);

    this._onRefresh = this._onRefresh.bind(this);
    this._onPress = this._onPress.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
    const {dispatch, projectId} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchVersions(projectId))
    });
  }

  _onPress(version) {
    const {onPress} = this.props
    onPress(version)
  }

  _onRefresh() {
    const {dispatch, projectId} = this.props;
    dispatch(fetchVersions(projectId))
  }

  _renderRow(version, index) {
    const {renderRowFunc} = this.props

    if (typeof renderRowFunc === 'function') {
      return renderRowFunc(version, index)
    }

    return <ListItem key={index} text={version.number} onPress={() => {this._onPress(version);}}/>;
  }

  render() {
    const {versionArray, isFetching} = this.props;
    const rows = versionArray.map(this._renderRow);

    return (
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={this._onRefresh}
            tintColor="#00a8ff"
          />
        }>
        {rows}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
