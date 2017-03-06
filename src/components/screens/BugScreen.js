import React, {Component} from 'react';
import {connect} from 'react-redux'
import {
  View as RNView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
  InteractionManager,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Router from '../../Router'
import {getPriority, getSeverity} from '../../utils/bug'
import {fetchBug} from '../../actions/bug'
import Attachment from '../Attachment'
import Comment from '../Comment'
import BugSeverity from '../BugSeverity'
import BugPriority from '../BugPriority'
import BugStatus from '../BugStatus'
import ButtonNavigate from '../ButtonNavigate'
import {View, Divider, Caption, Text, Title, Subtitle, Spinner} from '@shoutem/ui'
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionic from 'react-native-vector-icons/Ionicons';
import RefreshingIcon from '../RefreshingIcon'
import {updateBug} from '../../actions/bug'
import _ from 'lodash'

const loadData = (props, force = false) => {
  const {bugId, projectId} = props
  props.fetchBug(bugId, projectId, ['attachments', 'comments', 'steps'], force)
}

@connect((state, ownProps) => BugScreen.getStateProps(state, ownProps), {fetchBug})
export default class BugScreen extends Component {
  static getStateProps(state, ownProps) {
    const {
            pagination,
            entities: {bugs, bugTypeScheme, bugStatusScheme, versions, components}
          } = state;

    const bugPagination = pagination.bug[ownProps.bugId] || {};
    const {isFetching = true}= bugPagination;

    const bug = bugs[ownProps.bugId] || {}
    const component = components[bug.project_section_id]
    const version = versions[bug.project_version_id]
    const type = bugTypeScheme[bug.type_id]
    const status = bugStatusScheme[bug.status_id]
    const priority = getPriority(bug.priority_id) || {name: null}
    const severity = getSeverity(bug.severity_id) || {name: null}

    return {
      bug,
      component,
      type,
      version,
      status,
      priority,
      severity,
      isFetching,
    }
  }

  static propTypes = {
    bugId: React.PropTypes.number.isRequired,
    projectId: React.PropTypes.number.isRequired,
    title: React.PropTypes.string,
    bug: React.PropTypes.object,
  };

  static defaultProps = {
    title: 'Loading...',
  };

  static route = {
    navigationBar: {
      title(params) {
        if (params.number == undefined) {
          return 'Loading...'
        }

        return `Bug #${params.number}`;
      },
    }
  };

  constructor(props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
    this.navigate = this.navigate.bind(this)
    this.updateField = this.updateField.bind(this)
    this.setType = this.setType.bind(this)
    this.setStatus = this.setStatus.bind(this)
    this.setPriority = this.setPriority.bind(this)
    this.setSeverity = this.setSeverity.bind(this)
    this.setComponent = this.setComponent.bind(this)
    this.setVersion = this.setVersion.bind(this)
    this.setSteps = this.setSteps.bind(this)
    this.state = {
      firstLoad: props.isFetching == true
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      loadData(this.props)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching == false) {
      this.setState({firstLoad: false})
    }
  }

  renderAttachments() {
    const {bug: {attachments}} = this.props

    const list = attachments.map((file, i) => {
      return <Attachment hideRemove={true} key={file.id} file={file}/>;
    })

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        horizontal={true}
        style={[styles.horizontalScrollView]}>
        {list}
      </ScrollView>
    )

  }

  renderComments() {
    const {comments = []} = this.props.bug

    if (comments.length == 0) {
      return (
        <View style={{paddingVertical: 20, alignItems: 'center'}}>
          <Ionic color="#cecece" size={40} name="ios-chatbubbles"/>
          <Text>No comments yet</Text>
        </View>
      );
    }

    return (
      <RNView style={{flex: 1, flexDirection: 'column'}}>
        {comments.map((comment, index) => {
          return <Comment key={index} comment={comment}/>
        })}
      </RNView>
    );

  }

  renderExpected() {
    if (!this.props.bug.expected_results) {
      return <RNView/>;
    }
    const {bug} = this.props
    return (
      <RNView>
        <Subtitle style={{marginBottom: 10}}>Expected results</Subtitle>
        <TouchableOpacity onPress={() => {this.navigate('bugEdit', null, {bug, focusInputName: 'expected_results'})}}>
          <Text>{this.props.bug.expected_results}</Text>
        </TouchableOpacity>
      </RNView>
    )
  }

  onRefresh() {
    loadData(this.props, true)
  }

  navigate(screen, actionCallback = () => {
  }, params = {}) {
    this.props.navigator.push(Router.getRoute(screen, {...params, actionCallback}))
  }

  updateField(fieldName, value) {
    return updateBug(this.props.bugId, {[fieldName]: value})
  }

  setType(id) {
    return this.updateField('type_id', id)
  }

  setStatus(id) {
    return this.updateField('status_id', id)
  }

  setPriority(id) {
    return this.updateField('priority_id', id)
  }

  setSeverity(id) {
    return this.updateField('severity_id', id)
  }

  setComponent(id) {
    return this.updateField('project_section_id', id)
  }

  setVersion(id) {
    return this.updateField('project_version_id', id)
  }

  setSteps(steps) {
    return this.updateField('steps', steps)
  }

  render() {
    const {title, bug, isFetching, bug: {project_id, steps = []}, type, version, component, status, priority, severity,} = this.props;
    const {firstLoad} = this.state

    const stepsArray = _.map(steps, 'text')
    const stepsLabel = steps.length > 0 ? `${steps.length} steps` : 'None'

    if (firstLoad) {
      return (
        <View style={StyleSheet.flatten({backgroundColor: '#F2F2F2'})}>
          <View style={StyleSheet.flatten(styles.container)}>
            <Title>{bug.title || title}</Title>
            <Spinner size="large" style={StyleSheet.flatten({marginTop: 20})}/>
          </View>
        </View>
      )
    }

    const attachmentIcon = () => {
      return <Icon name='paperclip' size={16} style={{color: '#2b333f', marginRight: 10}}/>
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={this.onRefresh}
            tintColor="#00a8ff"
          />
        }>

        <RNView style={{backgroundColor: '#F2F2F2'}}>
          <RNView style={[styles.container, {paddingBottom: 0}]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {this.navigate('bugEdit', null, {bug, focusInputName: 'title'})}}>
              <Title style={{marginBottom: 20}}>{bug.title}</Title>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {this.navigate('bugEdit', null, {bug, focusInputName: 'description'})}}>
              <Text style={{marginBottom: 20, fontSize: 15}}>{bug.description || 'No description'}</Text>
            </TouchableOpacity>
            {this.renderExpected()}

            <ButtonNavigate
              biggerSubText={false}
              containerStyle={styles.buttonNavigation}
              onPress={() => {this.navigate('bugSteps', this.setSteps, {steps: stepsArray,projectId: project_id})}}
              text="Steps to reproduce" subText={stepsLabel}/>
          </RNView>

          <RNView>
            {this.renderAttachments()}

            {/*<ButtonNavigate onPress={this._onPressAddAttachment} text="Add attachment" leftIcon={attachmentIcon}*/}
            {/*rightIcon={false}/>*/}

            <Divider styleName="line"/>

            <RNView style={[styles.container, {paddingTop:0}]}>
              <ButtonNavigate
                containerStyle={styles.buttonNavigation}
                text="Status" subText={status ? status.name : null}
                onPress={() => {this.navigate('bugStatus', this.setStatus, {projectId: project_id, selectedId: status.id})}}
                middleIcon={() => {return status ? this.renderStatusIcon(status.color) : null}}/>

              <ButtonNavigate
                containerStyle={styles.buttonNavigation}
                text="Priority" subText={priority ? priority.name : null}
                onPress={() => {this.navigate('bugPriority', this.setPriority, {projectId: project_id, selectedId: bug.priority_id})}}
                middleIcon={() => {return this.renderPriorityIcon(bug.priority_id)}}/>

              <ButtonNavigate
                containerStyle={styles.buttonNavigation}
                text="Severity" subText={severity ? severity.name : null}
                onPress={() => {this.navigate('bugSeverity', this.setSeverity, {projectId: project_id, selectedId: bug.severity_id})}}
                middleIcon={() => {return this.renderSeverityIcon(bug.severity_id)}}/>

              <ButtonNavigate
                containerStyle={styles.buttonNavigation}
                text="Type" subText={type ? type.name : null}
                onPress={() => {this.navigate('bugType', this.setType, {projectId: project_id, selectedId: bug.type_id})}}/>

              <ButtonNavigate
                containerStyle={styles.buttonNavigation}
                onPress={() => {this.navigate('bugVersion', this.setVersion, {projectId: project_id, selectedId: bug.project_version_id})}}
                text="Version" subText={version ? version.number : null}/>
              <ButtonNavigate
                containerStyle={styles.buttonNavigation}
                onPress={() => {this.navigate('bugComponent', this.setComponent, {projectId: project_id, selectedId: bug.project_section_id})}}
                text="Component" subText={component ? component.name : null}/>
            </RNView>

            <Divider styleName="section-header">
              <Caption>Comments</Caption>
            </Divider>
            <RNView style={styles.container}>
              {this.renderComments()}
            </RNView>
          </RNView>

        </RNView>

      </ScrollView>
    )
  }

  renderSeverityIcon(id) {
    return (
      <RNView style={styles.icons}>
        <BugSeverity iconSize={20} id={id}/>
      </RNView>
    )
  }

  renderPriorityIcon(id) {
    return (
      <RNView style={styles.icons}>
        <BugPriority iconSize={20} id={id}/>
      </RNView>
    )
  }

  renderStatusIcon(color) {
    return (
      <RNView style={styles.icons}>
        {/*<RefreshingIcon />*/}
        <BugStatus color={color}/>
      </RNView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: 16,
    color: '#030303',
  },
  section: {
    fontWeight: "500",
  },
  expectedResultsTitle: {
    marginTop: 20,
  },
  description: {
    marginTop: 15,
    fontSize: 14,
    color: '#030303',
    fontWeight: "400",
    fontFamily: 'OpenSans'
  },
  results: {
    marginTop: 5,
    fontSize: 14,
    color: '#030303',
    fontWeight: "400",
    fontFamily: 'OpenSans'
  },
  scrollview: {
    flex: 1,
  },
  separator: {
    marginTop: 20,
  },
  //thumbnails
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  buttonNavigation: {
    paddingHorizontal: 0
  },
  buttonContents: {
    flexDirection: 'row',
    width: 64,
    height: 64,
  },
  img: {
    width: 64,
    height: 64,
  },
  horizontalScrollView: {
    paddingLeft: 10,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  icons: {
    flex: 0,
    width: 30,
    height: 30,
    marginRight: 4,
  },
});
