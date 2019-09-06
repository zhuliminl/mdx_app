/*
 * Created by Saul at 2019/06/05
 *
 * 热更新调试页面
 *
 */

import React from 'react'
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, StatusBar } from 'react-native';
import {p} from "./p";


class DebugPage extends React.Component {
  render() {
    return (
      <TouchableOpacity
      >
        <Text style={styles.itemText}>Debug</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
  },
})

export default DebugPage
