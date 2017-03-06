import React, {Component} from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fetchOrganizations} from '../../actions/organization'
import {signOut} from '../../actions/currentUser'
import Avatar from '../Avatar'

@connect(state => ProfileScreen.getStateProps(state))
// @withNavigation
export default class ProfileScreen extends Component {
  static defaultProps = {
    isFetching: true,
  };

  static getStateProps(state) {
    const {
            pagination,
            currentUser,
            entities: {organizations}
          } = state;

    const orgsPagination = pagination.organizations.all || {ids: []};
    const orgsArray = orgsPagination.ids.map(id => organizations[id]);
    const {isFetching}= orgsPagination;

    return {
      currentUser,
      orgsArray,
      isFetching
    };
  }

  constructor(props) {
    super(props)
    this.onLogOut = this.onLogOut.bind(this)
  }

  getFullName() {
    const {currentUser} = this.props;

    return `${currentUser.first_name} ${currentUser.last_name}`
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchOrganizations())
  }

  onLogOut() {
    const {dispatch} = this.props
    //
    this.props.navigation.getNavigator('root').pop()
    dispatch(signOut())
  }

  render() {

    const {currentUser} = this.props;

    return (
      <ScrollView>
        <View style={styles.header}>
          {this.renderAvatar()}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{this.getFullName()}</Text>
            <Text style={styles.infoTitle}>{currentUser.email}</Text>
            <Button title="Log out" onPress={this.onLogOut}/>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.orgTitleContainer}>
            <Ionicons name="ios-people" size={20} style={styles.orgTitleIcon}/>
            <Text style={styles.orgTitle}>ORGANIZATIONS</Text>
          </View>
          {this.renderOrgs()}
        </View>
      </ScrollView>
    )
  }

  renderAvatar() {
    const {currentUser: {avatar, first_name, last_name}} = this.props;

    if (!avatar) {

      let initials = first_name.substring(0, 1)
      if (!last_name) {
        initials += last_name.substring(0, 1)
      } else {
        initials += first_name.substring(1, 2)
      }

      return (
        <Avatar size={100} label={initials.toUpperCase()}/>
      )
    }

    return <Avatar size={100} imageSource={{uri: avatar}}/>
  }

  renderOrgs() {
    const {orgsArray, isFetching} = this.props;

    if (isFetching) {
      return <ActivityIndicator
        animating={true}
        style={[styles.centering, {height: 80}]}
        size="large"
      />;
    }

    return orgsArray.map((org, ii) => {
      return (
        <View key={ii} style={styles.orgContainer}>
          <Text style={styles.orgName}>{org.name}</Text>
          <Text style={styles.orgRole}>{org.role.name}</Text>
        </View>
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#246EE9',
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  infoTitle: {
    color: '#fff',
    marginBottom: 5,
  },
  orgTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#4B89FB',
    marginTop: 10,
    marginBottom: 10,
  },
  orgTitleIcon: {
    marginRight: 3
  },
  orgTitle: {
    color: '#494949',
    fontSize: 15,
    fontWeight: '500',
  },
  orgName: {
    // marginBottom: 2,
  },
  orgContainer: {
    flex: 1,
    marginBottom: 8,
  },
  orgRole: {
    color: '#b4b4b4',
    fontSize: 12,
    fontWeight: '500',
  },
});
