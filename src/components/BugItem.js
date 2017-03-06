import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View as RNView,
  Text,
} from 'react-native';
import Shadows from '../style/shadows'

import {timeAgo} from '../lib/date'
import BugPriority from './BugPriority'
import BugSeverity from './BugSeverity'
import Refreshing from './RefreshingIcon'
import {Divider, Row, View, Icon, Subtitle, Caption} from '@shoutem/ui'

export default class BugItem extends Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired,
    statusColor: React.PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.title !== nextProps.title || this.props.status_id !== nextProps.status_id || this.priority_id !== nextProps.priority_id
  }

  render() {
    const {onPress, data, statusColor} = this.props;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={styles.touchable}>
        <Row style={StyleSheet.flatten([styles.row, {borderTopColor: statusColor, borderTopWidth: 2}])}>
          <Text style={{position: 'absolute', right: 10, top:5, fontSize: 10, color: '#C0BFC0'}}>#{data.number}</Text>
          <RNView style={styles.icons}>
            <BugSeverity iconSize={20} id={data.severity_id}/>
            {data.priority_id && <BugPriority style={{marginTop: 10}} iconSize={20} id={data.priority_id}/>}
          </RNView>
          <View styleName="vertical stretch space-between">
            <Subtitle>{data.title}</Subtitle>
            <Caption>{timeAgo(data.created_at)}</Caption>
          </View>
          {data.syncing || data.isCreating && <Refreshing />}
          <Icon name="right-arrow" styleName="disclosure"/>
        </Row>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 4,
    borderLeftWidth: 0.5,
    borderLeftColor: '#dddddd',
    borderRightWidth: 0.5,
    borderRightColor: '#dddddd',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dddddd',
    ...Shadows.white40.bottom,
  },
  text: {
    color: '#030303',
    fontFamily: 'QuickSand',
    fontSize: 15,
    fontWeight: "500"
  },
  subtext: {
    color: '#656565',
    marginTop: 4,
    flexWrap: 'wrap'
  },
  scrollview: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  icons: {
    // alignSelf: 'center',
    flex: 0,
    width: 30,
    height: 30,
    borderRadius: 3,
    // marginLeft: -10,
    marginRight: 4,
  },
  touchable: {
    flex: 1,
    padding: 10,
  },
});
