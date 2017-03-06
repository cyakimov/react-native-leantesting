import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  InteractionManager,
  LayoutAnimation,
  Alert,
} from 'react-native';
import ImagePicker from'react-native-image-picker';
import {withNavigation} from '@exponent/ex-navigation';
import {connect} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import Icon from 'react-native-vector-icons/FontAwesome';
import {getPriority, getSeverity} from '../../utils/bug'
import * as formActions from '../../actions/bugReport'
import Router from '../../Router'
import Attachment from '../Attachment'
import NavBarButton from '../NavBarButton'
import ButtonNavigate from '../ButtonNavigate'
import ProgressBar from '../ProgressBar'
import {Divider, Row, Image, Caption} from '@shoutem/ui'
import _ from 'lodash'
import Alerts from '../../constants/Alerts'
import {base64MimeType} from '../../utils/file'
import {FILE_SIZE_LIMIT} from '../../state/Constants'

@connect(state => ({enabled: !state.bugReport.isUploading}))
class LeftButton extends React.Component {
  render() {
    const {eventEmitter, enabled} = this.props
    return (
      <NavBarButton muted={!enabled} text='Cancel' style={[styles.navBarCancel, styles.navBarButton]}
                    onPress={() => eventEmitter.emit('cancel')}/>
    )
  }
}

@connect(state => ({enabled: state.bugReport.hasRequiredFields && !state.bugReport.isUploading}))
class RightButton extends React.Component {
  render() {
    const {eventEmitter, enabled} = this.props
    return (
      <NavBarButton muted={!enabled} text='Create' style={[styles.navBarCreate, styles.navBarButton]}
                    onPress={() => eventEmitter.emit('create')}/>
    )
  }
}

@withNavigation
@connect((state, ownProps) => BugReportFormScreen.getStateProps(state, ownProps))
export default class BugReportFormScreen extends Component {
  _subscriptionCancel: EventSubscription;

  static getStateProps(state, ownProps) {
    const {bugReport, bugReport: {bugCreated, uploadError, errorMessage}, entities: {projects, bugTypeScheme, bugStatusScheme, components, versions}} = state;
    const project = projects[bugReport.projectId] || {id: null};
    const component = components[bugReport.projectComponentId]
    const version = versions[bugReport.projectVersionId]
    return {
      bugReport,
      uploadError,
      bugCreated,
      errorMessage,
      project,
      bugTypeScheme,
      bugStatusScheme,
      component,
      version,
      projectId: bugReport.projectId,
    }
  }

  static route = {
    navigationBar: {
      title: 'New bug',
      renderLeft: (state: ExNavigationState) => {
        const {config: {eventEmitter}} = state;
        return (
          <LeftButton eventEmitter={eventEmitter}/>
        )
      },
      renderRight: (state: ExNavigationState) => {
        const {config: {eventEmitter}} = state;
        return (
          <RightButton eventEmitter={eventEmitter}/>
        )
      },
    }
  };

  pickerOptions = {
    title: 'Add attachment',
    mediaType: 'mixed',
    takePhotoButtonTitle: 'Take a photo or video',
    // allowsEditing: true,
    storageOptions: {
      cameraRoll: true,
    }
  }

  constructor(props) {
    super(props)
    this._handleCancel = this._handleCancel.bind(this)
    this._handleCreate = this._handleCreate.bind(this)
    this.updateProgress = this.updateProgress.bind(this)
    this._navigate = this._navigate.bind(this)
    this._onPressAddAttachment = this._onPressAddAttachment.bind(this)
    this._onFileSelected = this._onFileSelected.bind(this)
    this.handleFileRemove = this.handleFileRemove.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onExpectedResultsChange = this.onExpectedResultsChange.bind(this)
    this.state = {
      uploadProgress: 0
    }
  }

  componentWillMount() {
    this._subscriptionCancel = this.props.route.getEventEmitter().addListener('cancel', this._handleCancel);
    this._subscriptionCreate = this.props.route.getEventEmitter().addListener('create', this._handleCreate);
  }

  componentWillUnmount() {
    this._subscriptionCancel.remove();
    this._subscriptionCreate.remove();
  }

  componentDidUpdate(prevProps) {
    const {dispatch, navigator, bugCreated, uploadError, errorMessage} = this.props
    if (!prevProps.uploadError && uploadError) {
      navigator.showLocalAlert(errorMessage || "An error occurred. Please try again", Alerts.error);
    }

    if (!prevProps.bugCreated && bugCreated) {
      const navigation = this.props.navigation.getNavigator('root')
      navigation.pop()
      navigation.showLocalAlert("Successfully created", Alerts.success);
      dispatch(formActions.reset())
    }
  }

  _getType() {
    if (!this.props.bugReport.projectId || !this.props.bugReport.typeId) {
      return null;
    }

    return this.props.bugTypeScheme[this.props.bugReport.typeId];
  }

  _getStatus() {
    if (!this.props.bugReport.projectId || !this.props.bugReport.statusId) {
      return null;
    }

    return this.props.bugStatusScheme[this.props.bugReport.statusId];
  }

  _handleCancel() {
    this.props.navigation.getNavigator('root').pop()
  }

  _handleCreate() {
    const {dispatch, navigator, bugReport: {projectId}} = this.props;
    const formData = this.getFormData()

    dispatch(formActions.createBug(projectId, formData, this.updateProgress))

    // request.upload({
    //   url: `https://api.leantesting.com/v1/projects/${projectId}/bugs`,
    //   formData,
    //   onSuccessCallback: (response) => {
    //     dispatch(formActions.createBugSuccess())
    //     this._handleCancel()
    //   },
    //   onFailedCallback: (status, response) => {
    //     dispatch(formActions.createBugFailed(status, response))
    //
    //   },
    //   onProgressCallback: (percent) => ),
    // })
  }

  updateProgress(progressEvent) {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    this.setState({uploadProgress: progress})
  }

  _navigate(screen, actionCallback = () => {
  }, params = {}) {
    this.props.navigator.push(Router.getRoute(screen, {...params, actionCallback}))
  }

  _onPressAddAttachment() {
    ImagePicker.showImagePicker(this.pickerOptions, this._onFileSelected);
  }

  _onFileSelected(response) {
    if (!response.didCancel && !response.error) {
      if (response.fileSize > FILE_SIZE_LIMIT) {
        // Works on both iOS and Android
        Alert.alert(
          'File Too Big',
          'The attachment needs to be less than 25,00MB. Choose a different file and try again',
        )
        return false;
      }

      // You can display the image using either data...
      const source = {
        url: 'data:image/jpeg;base64,' + response.data,
        name: response.fileName,
        size: response.fileSize,
      };
      const {dispatch} = this.props;
      dispatch(formActions.addFile(source))
    }
  }

  handleFileRemove(index) {
    LayoutAnimation.easeInEaseOut()
    const {dispatch} = this.props
    dispatch(formActions.removeFile(index))
  }

  onTitleChange(text) {
    const {dispatch} = this.props
    dispatch(formActions.setTitle(text))
  }

  onDescriptionChange(text) {
    const {dispatch} = this.props
    dispatch(formActions.setDescription(text))
  }

  onExpectedResultsChange(text) {
    const {dispatch} = this.props
    dispatch(formActions.setExpectedResults(text))
  }

  render() {
    const {project, component, version, bugReport: {isUploading, steps, projectId, projectComponentId, projectVersionId, statusId, severityId, priorityId, typeId}} = this.props
    const {uploadProgress} = this.state
    const hasProjectAndStatus = !isUploading && projectId !== null && statusId !== null
    const priority = getPriority(priorityId).name
    const severity = getSeverity(severityId).name
    const typeName = this._getType() ? this._getType().name : null
    const statusName = this._getStatus() ? this._getStatus().name : null

    const projectLabel = projectId === null ? 'Select a project' : project.name;//Crowdsourcedtesting.com — v.1

    const attachmentIcon = () => {
      return <Icon name='paperclip' size={16} style={{color: '#2b333f', marginRight: 10}}/>
    }
    const stepsLabel = steps.length > 0 ? `${steps.length} steps` : 'None'

    return (
      <View style={styles.outerContainer}>
        {isUploading && <ProgressBar progressTintColor="green" progress={uploadProgress / 100}/>}
        <KeyboardAwareScrollView>
          <View style={styles.innerContainer}>

            <View style={styles.details}>
              {this.renderDetails()}
            </View>

            <ButtonNavigate
              biggerSubText={false}
              containerStyle={{paddingLeft: 10}}
              onPress={() => {this._navigate('bugSteps', formActions.setSteps, {steps,projectId})}}
              disabled={isUploading}
              text="Steps to reproduce" subText={stepsLabel}/>

            {this.renderFiles()}

            <ButtonNavigate disabled={isUploading}
                            onPress={this._onPressAddAttachment}
                            text="Add attachment"
                            leftIcon={attachmentIcon}
                            rightIcon={false}/>

            <Divider styleName="line"/>

            <ButtonNavigate
              onPress={() => {this._navigate('projectFinder', formActions.setProject, {selectedId: projectId})}}
              disabled={isUploading} text="Project" subText={projectLabel}
              rightIcon="down-arrow"/>

            <ButtonNavigate
              onPress={() => {this._navigate('bugVersion', formActions.setVersion, {selectedId: projectVersionId,projectId})}}
              disabled={isUploading || projectId == null}
              text="Version" subText={version ? version.number : null}/>

            <ButtonNavigate
              onPress={() => {this._navigate('bugStatus', formActions.setStatus, {selectedId: statusId,projectId})}}
              disabled={isUploading || version == null}
              text="Status" subText={statusName}/>

            <ButtonNavigate
              onPress={() => {this._navigate('bugType', formActions.setType, {selectedId: typeId, projectId})}}
              disabled={!hasProjectAndStatus}
              text="Type"
              subText={typeName}/>
            <ButtonNavigate
              onPress={() => {this._navigate('bugPriority', formActions.setPriority, {selectedId: priorityId})}}
              disabled={!hasProjectAndStatus}
              text="Priority" subText={priority}/>
            <ButtonNavigate
              onPress={() => {this._navigate('bugSeverity', formActions.setSeverity, {selectedId: severityId})}}
              disabled={!hasProjectAndStatus}
              text="Severity" subText={severity}/>

            <ButtonNavigate
              onPress={() => {this._navigate('bugComponent', formActions.setComponent, {selectedId: projectComponentId, projectId})}}
              disabled={!hasProjectAndStatus}
              text="Component" subText={component ? component.name : null}/>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  renderFiles() {
    const {bugReport: {files, isUploading}} = this.props
    const rows = files.map((file, idx) => {
      return <Attachment hideRemove={isUploading} key={idx} file={file}
                         onPressRemove={() => {this.handleFileRemove(idx)}}/>;
    })

    if (rows.length == 0) {
      return null;
    }

    return (
      <ScrollView
        horizontal={true}
        style={styles.horizontalScrollView}
      >
        {rows}
      </ScrollView>
    )
  }

  renderDetails() {
    const {bugReport: {title, description, expected_results, isUploading}} = this.props;

    return (
      <View style={styles.detailsContainer}>
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={this.onTitleChange}
          editable={!isUploading} style={[styles.bugTitle, styles.text]}
          placeholder="Bug title" value={title}
          returnKeyType='done'/>
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={this.onDescriptionChange}
          editable={!isUploading} style={[styles.bugDescription, styles.text]}
          placeholder="Description"
          value={description} multiline={true}/>
        <TextInput
          underlineColorAndroid="transparent"
          onChangeText={this.onExpectedResultsChange}
          editable={!isUploading} style={[styles.bugDescription, styles.text]}
          placeholder="Expected results"
          value={expected_results} multiline={true}/>
      </View>
    )
  }

  getFormData(): FormData {
    const form = this.props.bugReport
    const formData = new FormData();

    //dynamically append form fields except:
    Object.keys(form).filter(k => ['files', 'steps'].indexOf(k) === -1).forEach(k => {
      const value = form[k]
      if (!value) {
        return;
      }

      formData.append(_.snakeCase(k), value);
    })

    form.steps.forEach(s => {
      formData.append('steps[]', s);
    })

    form.files.forEach((f) => {
      formData.append('file[]', {uri: f.url, type: base64MimeType(f.url), name: f.name});
    })

    return formData
  }

}

const styles = StyleSheet.create({
  navBarButton: {
    color: '#222',
    fontSize: 15,
    marginTop: 12
  },
  navBarCancel: {
    marginLeft: 10,
  },
  navBarCreate: {
    marginRight: 10,
  },
  outerContainer: {
    flex: 1
  },
  innerContainer: {
    paddingBottom: 30,
  },
  details: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sectionHeader: {
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    color: '#222222',
    marginTop: 15,
    marginBottom: 5
  },
  sectionDivider: {
    marginBottom: 5,
  },
  text: {
    fontFamily: 'OpenSans',
  },
  bugTitle: {
    fontSize: 18,
    height: 40,
  },
  bugDescription: {
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  footer: {
    borderWidth: 1
  },
  horizontalScrollView: {
    paddingLeft: 10,
    marginVertical: 20,
  }
});
