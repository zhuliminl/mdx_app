import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { p } from "../../utils/p";
import { tm } from '../../utils/theme';

const { icons } = tm;

export default ({ onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>设置紧急联系人</Text>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          onPress && onPress()
        }}
      >
        <Text style={styles.itemText}>紧急联系人</Text>
        <Image style={styles.contactIcon} source={icons.contact} />
      </TouchableOpacity>
    </View>
  )
}

const proportion = 0.5
const styles = StyleSheet.create({
  container: {

  },
  headerTitle: {
    paddingHorizontal: p.td(30),
    paddingTop: p.td(40),
    paddingBottom: p.td(20),
    fontSize: p.td(28),
    color: '#999',
  },
  item: {
    height: p.td(90),
    paddingHorizontal: p.td(30),
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  itemText: {
    color: '#4F5A6E',
    fontSize: p.td(32),
  },
  contactIcon: {
    width: p.td(96) * proportion,
    height: p.td(96) * proportion,
  }
})
