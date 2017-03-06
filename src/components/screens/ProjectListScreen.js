import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ProjectList from '../containers/ProjectList'

export default class ProjectListScreen extends Component {

  static route = {
    navigationBar: {
      title: 'My projects',
    }
  };

  render() {
    return (
      <ProjectList/>
    )
  }
}
