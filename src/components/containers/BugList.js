import React, {Component} from 'react';
import {connect} from 'react-redux'
import {withNavigation} from '@exponent/ex-navigation';
import {fetchBugs} from '../../actions/bug'
import Router from '../../Router'

import {
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  View,
} from 'react-native';

import {fetchBugsIfNeeded} from '../../actions/bug'
import BugItem from '../BugItem'
import {ListView} from '@shoutem/ui'

@connect((state, ownProps) => BugList.getStateProps(state, ownProps))
@withNavigation
export default class BugList extends Component {
  static defaultProps = {
    isFetching: true,
  };

  static getStateProps(state, ownProps) {
    const {
      pagination,
      entities: {bugs, projects, bugStatusScheme}
    } = state;

    const bugsPagination = pagination.bugsByProject[ownProps.projectId] || {ids: []};
    const statusIds = projects[ownProps.projectId].bugStatusScheme;
    const bugArray = bugsPagination.ids.map(id => bugs[id]);
    const _bugStatusScheme = statusIds.map(id => bugStatusScheme[id]);
    const {isFetching, nextPageUrl}= bugsPagination;

    return {
      bugArray,
      bugStatusScheme: _bugStatusScheme,
      bugsPagination,
      isFetching,
      hasMore: nextPageUrl !== null
    }
  }

  static propTypes = {
    projectId: React.PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this);
    this._onBugClick = this._onBugClick.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this._onLoadMore = this._onLoadMore.bind(this);
  }

  componentDidMount() {
    const {dispatch, projectId} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchBugs(projectId))
    });
  }

  _onBugClick(bug) {
    this.props.navigator.push(Router.getRoute('bug', {
      projectId: bug.project_id,
      bugId: bug.id,
      number: bug.number,
      title: bug.title,
    }))
  }

  _resolveStatusColor(statusId) {
    const status = this.props.bugStatusScheme.find((el) => {
      return el.id == statusId;
    });

    if (!status) {
      return '#fff'
    }

    return status.color;
  }

  onRefresh() {
    const {dispatch, projectId} = this.props;
    dispatch(fetchBugs(projectId, false, true))
  }

  _onLoadMore() {
    const {dispatch, projectId} = this.props;
    dispatch(fetchBugs(projectId, true))
  }

  renderRow(bug) {
    const itemProps = {
      statusColor: this._resolveStatusColor(bug.status_id),
      data: bug,
      onPress: () => this._onBugClick(bug),
    };

    return <BugItem {...itemProps} />;
  }

  render() {
    const {hasMore, bugArray, isFetching} = this.props;
    return (
      <View style={{flex: 1,backgroundColor: '#F8FCFF'}}>
        <ListView data={bugArray} loading={isFetching} onRefresh={this.onRefresh} onLoadMore={hasMore ? this._onLoadMore : null}
                  renderRow={this.renderRow}/>
      </View>
    )
  }
}
