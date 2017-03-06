import React, {Component} from 'react';
import {View, Text} from 'react-native';
import BugList from '../containers/BugList'

export default class ProjectScreen extends Component {

  static route = {
    navigationBar: {
      title(params) {
        return params.name;
      },
    }
  };

  render() {
    return (
      <BugList projectId={this.props.projectId}/>
    )
  }
}
