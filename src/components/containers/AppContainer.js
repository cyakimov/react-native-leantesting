import React, {Component} from 'react'
import {Provider as ReduxProvider, connect} from 'react-redux'
import App from '../App'

import {
  NavigationContext,
  NavigationProvider,
} from '@exponent/ex-navigation';

import Store from '../../state/Store';
import Router from '../../Router';
import ImageGallery from '@exponent/react-native-image-gallery';
import {getTheme} from '@shoutem/ui'
import {StyleProvider} from '@shoutem/theme';

const navigationContext = new NavigationContext({
  router: Router,
  store: Store,
});

const themeWithCustomFont = {
  ...getTheme(),
  defaultFont: {
    fontFamily: 'System',
  },
};

export default class AppContainer extends Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <NavigationProvider context={navigationContext}>
          <StyleProvider style={themeWithCustomFont}>
            <App {...this.props} />
          </StyleProvider>
          <ImageGallery />
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}
