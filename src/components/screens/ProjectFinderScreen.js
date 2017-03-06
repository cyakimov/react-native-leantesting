import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import ProjectList from '../containers/ProjectList'
import {NavigationStyles} from '@exponent/ex-navigation';
import ButtonSelect from '../ButtonSelect'
import SlimView from '../SlimView'
import {connect} from 'react-redux'

@connect()
export default class ProjectFinderScreen extends Component {
  static propTypes = {
    selectedId: React.PropTypes.number,
  }
  static route = {
    navigationBar: {
      visible: false,
    },
    styles: {
      ...NavigationStyles.SlideVertical,
    },
  }

  constructor(props) {
    super(props)
    this.onPressProject = this.onPressProject.bind(this)
    this.renderRow = this.renderRow.bind(this)
  }

  onPressProject(selectedId) {
    const {dispatch} = this.props;
    dispatch(this.props.actionCallback(selectedId))
    setTimeout(() => {
      this.props.navigator.pop();
    }, 50)
  }

  renderRow(project, index) {
    return <ButtonSelect checked={this.props.selectedId == project.id} key={index} text={project.name}
                         onPress={() => {this.onPressProject(project.id)}}/>
  }

  render() {
    return (
      <SlimView>
        <ProjectList renderRowFunc={this.renderRow}/>
      </SlimView>
    )
  }
}
