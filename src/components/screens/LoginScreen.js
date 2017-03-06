import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux'
import {NavigationStyles} from '@exponent/ex-navigation'
import moment from 'moment'
import Button from '../Button'
import LocalStorage from '../../state/LocalStorage'
import {fetchUser} from '../../actions/currentUser'

@connect(state => LoginScreen.getStateProps(state))
export default class LoginScreen extends Component {
  static route = {
    styles: {
      ...NavigationStyles.SlideVertical,
    },
  }

  static getStateProps(state) {
    const {auth, currentUser} = state;

    return {
      auth,
      currentUser,
      isRequesting: auth.requesting,
      hasToken: auth.access_token !== null,
      hasUser: currentUser.id !== null,
    };
  }

  state = {
    isLoading: false,
  }

  constructor(props) {
    super(props)
    this.onLoginPress = this.onLoginPress.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasToken) {
      let auth = {...nextProps.auth};
      this.setState({isLoading: true});

      auth.expires_in = moment().add(auth.expires_in, 'seconds');
      LocalStorage.saveAuthAsync(auth);
      if (nextProps.hasUser) {
        LocalStorage.saveUserAsync(nextProps.currentUser);
        this.props.navigator.push('home')
      } else {
        this.props.dispatch(fetchUser())
      }
    }
  }

  onLoginPress() {
    this.props.navigator.push('oauth')
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo}/>
        <View style={{marginTop: 20}}>
          {this.renderContent()}
        </View>
      </View>
    )
  }

  renderContent() {
    const {isRequesting} = this.props
    const {isLoading} = this.state
    if (isRequesting || isLoading) {
      return (
        <ActivityIndicator
          animating={true}
          style={[styles.indicator]}
          size="small"
        />
      )
    }

    return <Button
      label="Log in with CrowdTesting"
      onPress={this.onLoginPress}
      enableShadow={true}
      backgroundColor="#1992FC"/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#0081FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 96
  },
  button: {
    marginTop: 40
  }
})