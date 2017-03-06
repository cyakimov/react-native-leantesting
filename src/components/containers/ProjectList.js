import React, {Component} from 'react';
import {connect} from 'react-redux'
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  Text,
} from 'react-native';
import numeral from 'numeral'
import {withNavigation} from '@exponent/ex-navigation';
import {fetchProjects} from '../../actions/project'
import Router from '../../Router'
import {ListView, Row, Subtitle, Caption, View, Icon, Divider} from '@shoutem/ui'
import Colors from '../../style/colors'
import Shadows from '../../style/shadows'

@withNavigation
@connect(state => ProjectList.getStateProps(state))
export default class ProjectList extends Component {
  static propTypes = {
    renderRowFunc: React.PropTypes.func,
    onProjectPress: React.PropTypes.func,
  }
  static defaultProps = {
    isFetching: true,
  };

  static getStateProps(state) {
    const {
            pagination,
            entities: {projects}
          } = state;

    const projectsPagination = pagination.projects.all || {ids: []};
    const projectArray = projectsPagination.ids.map(id => projects[id]).filter(p => p.role.permissions['bug.create'] == true);
    const {isFetching, nextPageUrl}= projectsPagination;

    return {
      projectArray,
      projectsPagination,
      isFetching,
      hasMore: nextPageUrl !== null
    }
  }

  constructor(props) {
    super(props);

    this.onRefresh = this.onRefresh.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onPressProject = this.onPressProject.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchProjects())
    });
  }

  onPressProject(project) {
    const {onProjectPress} = this.props
    if (typeof onProjectPress === 'function') {
      onProjectPress(project)
    } else {
      this.props.navigator.push(Router.getRoute('project', {
        projectId: project.id,
        name: project.name,
      }))
    }

  }

  onLoadMore() {
    const {dispatch} = this.props;
    dispatch(fetchProjects(false, true))
  }

  onRefresh() {
    const {dispatch} = this.props;
    dispatch(fetchProjects(true))

  }

  render() {
    const {projectArray, isFetching, hasMore} = this.props;
    return (
      <View style={{flex: 1,backgroundColor: '#F8FCFF'}}>
        <ListView data={projectArray} loading={isFetching} onRefresh={this.onRefresh} renderRow={this.renderRow} onLoadMore={hasMore ? this.onLoadMore : null}/>
      </View>
    )
  }

  renderRow(project, index) {
    const {renderRowFunc} = this.props

    if (typeof renderRowFunc === 'function') {
      return renderRowFunc(project, index)
    }

    return (
      <TouchableOpacity style={styles.touchable} onPress={() => {this.onPressProject(project);}}>
        <Row style={StyleSheet.flatten([styles.row])}>
          {/*<Text style={{position: 'absolute', right: 10, top:5, fontSize: 10, color: '#C0BFC0'}}>Crowdsourced Testing</Text>*/}
          <View styleName="vertical stretch space-between">
            <Subtitle>{project.name}</Subtitle>
            {/*<Caption style={StyleSheet.flatten({color: '#9D9D9D'})}>{project.role.name}</Caption>*/}
            {/*<Caption style={StyleSheet.flatten({color: '#9D9D9D'})}>Crowdsourced Testing</Caption>*/}
            <View>
              {this.renderStats(project)}
            </View>
          </View>
          <Icon styleName="disclosure" name="right-arrow"/>
        </Row>
      </TouchableOpacity>
    );
  }

  renderStats(project: Object) {
    let color = Colors.green10
    let label

    if (project) {
      const number =  project.stats.open_bugs || 0;

      if (number === 0) {
        label = "No open bugs"
      } else if (number === 1) {
        color = Colors.orange10
        label = "Just 1 bug open"
      } else {
        color = Colors.orange10
        const format = number > 1000 ? '0.0a' : '0a'
        label = `${number > 1000 ? '+': ''}${numeral(number).format(format)} open bug${number > 1 ? 's' : ''}`
      }

    }

    return (
      <Caption style={StyleSheet.flatten({color})}>{label}</Caption>
    )
  }
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  row: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    ...Shadows.dark40.bottom,
  },
});
