import React, {Component} from 'react';
import {connect} from 'react-redux'
import {ScrollView, RefreshControl, StyleSheet, InteractionManager} from 'react-native';
import {withNavigation} from '@exponent/ex-navigation';
import ListItem from '../ListItem'
import {fetchComponents} from '../../actions/component'

@withNavigation
@connect((state, ownProps) => ComponentList.getStateProps(state, ownProps))
export default class ComponentList extends Component {
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
      entities: {components, projects}
    } = state;

    const componentsPagination = pagination.componentsByProject[ownProps.projectId] || {ids: []};
    const componentArray = componentsPagination.ids.map(id => components[id]);
    const {isFetching = true}= componentsPagination;

    return {
      componentArray,
      componentsPagination,
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
      dispatch(fetchComponents(projectId))
    });
  }

  _onPress(component) {
    const {onPress} = this.props
    onPress(component)
  }

  _onRefresh() {
    const {dispatch, projectId} = this.props;
    dispatch(fetchComponents(projectId))
  }

  _renderRow(component, index) {
    const {renderRowFunc} = this.props

    if (typeof renderRowFunc === 'function') {
      return renderRowFunc(component, index)
    }

    return <ListItem key={index} text={component.name} onPress={() => {this._onPress(component);}}/>;
  }

  render() {
    const {componentArray, isFetching} = this.props;
    const rows = componentArray.map(this._renderRow);

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
