/**
 * @flow
 */
import React, {Component} from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import Router from '../../Router'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux'
import Shadows from '../../style/shadows'
import Colors from '../../style/colors'

import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem as TabItem,
  NavigationStyles,
} from '@exponent/ex-navigation';

type TabIconProps = {
  title: string,
  iconSize: number,
  iconName: string,
  selectedIconName: string,
  isSelected: bool,
  forceColor: string
};

@connect(state => ({isUploading: state.bugReport.isUploading, uploadProgress: state.bugReport.uploadProgress}))
export default class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this._onPressReportBug = this._onPressReportBug.bind(this);
  }

  render() {
    return (
      <TabNavigation
        tabBarStyle={styles.tabBarStyle}
        tabBarHeight={45}
        id="main"
        navigatorUID="master"
        initialTab="projects">
        <TabItem
          id="projects"
          renderIcon={isSelected => this._renderIcon({iconName: 'md-list-box', selectedIconName: 'md-list-box', iconSize: 28, isSelected})}>
          <StackNavigation
            id="projects"
            initialRoute={Router.getRoute('projects')}
            defaultRouteConfig={{
            navigationBar: {
              backgroundColor: '#FFF',//4B89FB
              tintColor: '#333333',//fff,
              titleStyle: { fontFamily: "System" },
            }
          }}
          />
        </TabItem>
        <TabItem
          id="report"
          renderIcon={this._renderReportButton}
          onPress={this._onPressReportBug}
        />

        <TabItem
          id="profile"
          renderIcon={isSelected => this._renderIcon({iconName: 'ios-person', selectedIconName: 'ios-person', isSelected})}>
          <StackNavigation
            id="profile"
            initialRoute={Router.getRoute('profile')}
          />
        </TabItem>

      </TabNavigation>
    )
  }

  _onPressReportBug() {
    this.props.navigation.getNavigator('root').push('report')
  }

  _renderReportButton(): ReactElement<View> {
    const iconSize = 32
    const iconName = 'ios-bug-outline'
    let color = Colors.orange10

    return (
      <View style={[styles.tabItemContainer, styles.tabBug]}>
        <Ionic name={iconName} size={iconSize} color={color}/>
      </View>
    );
  }

  _renderIcon(props: TabIconProps): ReactElement<View> {
    const {title, iconName, selectedIconName, isSelected, forceColor, iconSize = 32} = props
    let color = forceColor ? forceColor : (isSelected ? '#246EE9' : '#9DA5B2');

    return (
      <View style={styles.tabItemContainer}>
        <Ionic name={isSelected && selectedIconName ? selectedIconName : iconName} size={iconSize} color={color}/>

        {title &&
        <Text style={[styles.tabTitleText]} numberOfLines={1}>
          {title}
        </Text>
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBarStyle: {
    backgroundColor: '#FEFEFE',
    borderTopWidth: 1,
    borderTopColor: Colors.dark70,
    ...Shadows.white40.top,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBug:{
    backgroundColor: '#FEFEFE',
    borderColor: Colors.dark80,
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    ...Shadows.white40.bottom,
  },
  tabTitleText: {
    fontSize: 11,
  },
});
