import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

export default class ListItem extends Component {
  static propTypes = {
    onPress: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired,
    subText: React.PropTypes.string.isRequired,
  };

  render() {
    const {onPress, text, subText} = this.props;

    return (
      <TouchableHighlight underlayColor="#eeeeee" onPress={onPress}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {text}
            </Text>
            <Text style={styles.subtext}>{subText}</Text>
          </View>
          <View style={{alignSelf:'flex-end'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
              <Ionicons name='ios-arrow-forward' style={{fontSize: 14, color: '#2b333f'}}/>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: 'Quicksand',
    color: '#030303',
  },
  subtext: {
    color: '#656565',
    marginTop: 4
  },
});
