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
} from 'react-native';

import {NavigationStyles} from '@exponent/ex-navigation';
import {View, Text, Title, Subtitle} from '@shoutem/ui'
import {updateBug} from '../../actions/bug'
import AutoExpandingTextInput from '../AutoExpandingTextInput'
import NavBarButton from '../NavBarButton'

@connect()
export default class BugEditScreen extends Component {
  static propTypes = {
    bug: React.PropTypes.object.isRequired,
    focusInputName: React.PropTypes.string
  };

  static route = {
    navigationBar: {
      title(params) {
        return `Bug #${params.bug.number}`;
      },
      renderLeft: (state: ExNavigationState) => {
        const {config: {eventEmitter}} = state;
        return (
          <NavBarButton text='Cancel' style={[styles.navBarCancel, styles.navBarButton]}
                        onPress={() => eventEmitter.emit('cancel')}/>
        )
      },
      renderRight: (state: ExNavigationState) => {
        const {config: {eventEmitter}} = state;
        return (
          <NavBarButton text='Save' style={[styles.navBarCreate, styles.navBarButton]}
                        onPress={() => eventEmitter.emit('save')}/>
        )
      },
    },
    styles: {...NavigationStyles.Fade},
  };

  _subscriptionCancel: EventSubscription;

  constructor(props) {
    super(props)
    this.state = {
      title: props.bug.title,
      description: props.bug.description,
      expected_results: props.bug.expected_results,
      updated: false,
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.updateExpected = this.updateExpected.bind(this)
  }

  componentWillMount() {
    this._subscriptionCancel = this.props.route.getEventEmitter().addListener('cancel', this.handleCancel);
    this._subscriptionCreate = this.props.route.getEventEmitter().addListener('save', this.handleSave);
  }

  componentWillUnmount() {
    this._subscriptionCancel.remove();
    this._subscriptionCreate.remove();
  }

  handleCancel() {
    this.props.navigator.pop()
  }

  handleSave() {
    const {bug, dispatch} = this.props
    this.props.navigator.pop()
    let updatedFields = {};

    ['title', 'description', 'expected_results'].forEach((f) => {
      if (this.state[f] !== bug[f]) {
        updatedFields[f] = this.state[f]
      }
    })
    !
    dispatch(updateBug(bug.id, updatedFields))
  }

  updateTitle(title) {
    this.setState({title, updated: true})
  }

  updateDescription(description) {
    this.setState({description, updated: true})
  }

  updateExpected(expected_results) {
    this.setState({expected_results, updated: true})
  }

  render() {
    const {bug, focusInputName} = this.props;
    return (
      <ScrollView>
        <RNView style={{backgroundColor: '#F2F2F2'}}>
          <RNView style={StyleSheet.flatten(styles.container)}>
            <AutoExpandingTextInput
              autoFocus={focusInputName == 'title'}
              placeholder="Bug title"
              onChangeText={this.updateTitle}
              style={styles.title}
              value={bug.title}/>
            <AutoExpandingTextInput
              autoFocus={focusInputName == 'description'}
              maxHeight={200}
              placeholder="Add a description"
              onChangeText={this.updateDescription}
              style={styles.description}
              value={bug.description}/>
            <Subtitle style={{marginTop: 20, marginBottom: 10}}>Expected results</Subtitle>
            <AutoExpandingTextInput
              autoFocus={focusInputName == 'expected_results'}
              maxHeight={200}
              placeholder="None"
              onChangeText={this.updateExpected}
              style={styles.description}
              value={bug.expected_results}/>
          </RNView>
        </RNView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  title: {
    color: '#222222',
    marginBottom: 20,
    borderWidth: 0,
    paddingLeft: 0,
    fontFamily: 'Rubik-Regular',
    fontSize: 20,
    paddingVertical: 0,
    lineHeight: 25,
    letterSpacing: 1,
  },
  description: {
    color: '#666',
    paddingLeft: 0,
    paddingTop: 0,
    borderWidth: 0,
    marginBottom: 20,
    fontSize: 15,
  },
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
});
