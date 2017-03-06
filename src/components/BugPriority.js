import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const BugPriority = (props) => {
  const {id, iconSize, style} = props

  if (!id) {
    return null;
  }

  const bars = Array(id).fill().map((_, key) => {
      return <View key={key} style={[styles.bar, {backgroundColor: '#e44d22', width: iconSize}]}/>;
    }
  );

  return (
    <View style={[styles.container, {width: iconSize}, style]}>
      {bars}
    </View>
  )
}

BugPriority.propTypes = {
  id: React.PropTypes.number,
  iconSize: React.PropTypes.number,
  style: React.PropTypes.any,
}
BugPriority.defaultProps = {
  iconSize: 16,
};

export default BugPriority

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    height: 2,
    marginBottom: 2
  }
});
