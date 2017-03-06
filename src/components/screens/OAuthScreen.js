import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  WebView,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux'
import {NavigationStyles} from '@exponent/ex-navigation'
import shittyQs from 'shitty-qs'
import {OAUTH, OAUTH_AUTHORIZE_URI} from '../../state/Constants'
import SlimView from '../SlimView'
import {requestToken}  from '../../actions/auth'

@connect()
export default class OAuthScreen extends Component {
  static route = {
    styles: {
      ...NavigationStyles.SlideVertical,
      gestures: null,
    },
  }

  AUTH_URL = `${OAUTH_AUTHORIZE_URI}?client_id=${OAUTH.client_id}&redirect_uri=${encodeURI(OAUTH.redirect_uri)}&scope=admin`

  constructor(props) {
    super(props)
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    this.state = {
      loading: true,
    }
  }

  handleAction(response) {
    if (response.code) {
      const {dispatch} = this.props
      dispatch(requestToken(response.code))
    }

    this.props.navigator.pop();
  }

  onNavigationStateChange(navState) {
    if (navState.url.indexOf(OAUTH.redirect_uri) === 0 && navState.loading === false) {
      this.setState({loading: true})
      const [, query_string] = navState.url.match(/\?(.*)/)
      const query = shittyQs(query_string)

      this.handleAction(query)
    } else {
      this.setState({loading: navState.loading})
    }
  }

  render() {
    const {loading} = this.state
    return (
      <SlimView>
        <WebView
          ref="webview"
          source={{uri: this.AUTH_URL}}
          startInLoadingState={true}
          renderLoading={()=> this.renderLoader()}
          onNavigationStateChange={this.onNavigationStateChange}
          style={{}}
        />
        {loading && this.renderLoader()}
      </SlimView>
    )
  }

  renderLoader(){
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          animating={true}
          size="small"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    backgroundColor: '#FFF',
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: 'center',
    justifyContent: 'center',
  },
})
