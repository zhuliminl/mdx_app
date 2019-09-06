import React from 'react'
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, StatusBar } from 'react-native';
import { p } from "./p";


class TestZone extends React.Component {
  render() {
    return (
      <TouchableOpacity
      >
        <Text style={styles.itemText}>foo</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
  },
})

export default TestZone
