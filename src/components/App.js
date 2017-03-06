import React from 'react';
import {connect} from 'react-redux'
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {
  withNavigation,
  StackNavigation,
} from '@exponent/ex-navigation';
import Router from '../Router'
import LocalStorage from '../state/LocalStorage'
import LoadingView from './LoadingView'
import {setAuth} from '../actions/auth'
import {setUser} from '../actions/currentUser'

@withNavigation
@connect(state => App.getStateProps(state))
export default class App extends React.Component {
  static getStateProps(state) {
    return {
      currentUser: state.currentUser,
      auth: state.auth,
      networkActivityIndicatorVisible: state.networkActivityIndicatorVisible,
      // isGlobalLoadingVisible: data.apiState.isLoading,
    };
  };

  state = {
    bootstrapIsComplete: false,
  };

  componentWillMount() {
    this.bootstrap();
  }

  componentDidUpdate(prevProps) {
    if (!this.state.bootstrapIsComplete) {
      return;
    }

    // const useDrawerNavigation = Platform.OS === 'android'
    // const navigationLayoutRoute = useDrawerNavigation ? 'drawerNavigationLayout' : 'tabNavigationLayout'
    const rootNavigator = this.props.navigation.getNavigator('root')

    if (!isLoggedIn(prevProps.auth) && isLoggedIn(this.props.auth)) {
      // rootNavigator.replace(Router.getRoute(navigationLayoutRoute));
    } else if (isLoggedIn(prevProps.auth) && !isLoggedIn(this.props.auth)) {
      rootNavigator.replace(Router.getRoute('login'));
    }
  }

  render() {
    const {networkActivityIndicatorVisible} = this.props
    if (!this.state.bootstrapIsComplete) {
      return <LoadingView />;
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay}/>}
        {Platform.OS === 'ios' &&
        <StatusBar networkActivityIndicatorVisible={networkActivityIndicatorVisible} animated/>}

        <StackNavigation
          id="root"
          initialRoute={getInitialRoute(this.props.auth)}
        />
      </View>
    );
  }

  async bootstrap() {
    try {
      let fetchAuth = LocalStorage.getAuthAsync();
      let fetchUser = LocalStorage.getUserAsync();

      let [ auth, currentUser ] = await Promise.all([
        fetchAuth,
        fetchUser,
      ]);

      auth && this.props.dispatch(setAuth(auth));
      currentUser && this.props.dispatch(setUser(currentUser));
      this.setState({bootstrapIsComplete: true});
    } catch (e) {
      Alert.alert('Error on bootstrap!', e.message);
    }
  }

}

function isLoggedIn(authState) {
  return !!authState.access_token //|| moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
}

function getInitialRoute(auth) {
  if (isLoggedIn(auth)) {
    return Router.getRoute('home');
  } else {
    return Router.getRoute('login');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarUnderlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
