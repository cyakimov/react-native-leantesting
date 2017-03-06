import React, {Component} from 'react';
import ReactNative from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {
        View,
        StyleSheet,
      } = ReactNative;

function getColor(id) {
  switch (id) {
    case 1:
      return '#f0d284'
    case 2:
      return '#ff8c23'
    case 3:
      return '#e40613'
    case 4:
      return '#c1c1c1'
    default:
      return '#000'
  }
}

const BugSeverity = (props) => {
  const {id, iconSize, style} = props
  if (!id) {
    return null;
  }

  const color = getColor(id)
  const iconName = id == 3 ? 'ios-flame' : 'ios-warning'

  return (
    <View style={[styles.iconContainer, {width: iconSize}, style]}>
      <Icon name={iconName} style={{fontSize: iconSize, color}}/>
    </View>
  )
}

BugSeverity.propTypes = {
  id: React.PropTypes.number,
  iconSize: React.PropTypes.number,
  style: React.PropTypes.any,
}
BugSeverity.defaultProps = {
  type: 'icon',
  iconSize: 16,
};

export default BugSeverity

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }
});
