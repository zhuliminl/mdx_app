import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { p } from "../../utils/p";

export default ({ ECList, onDel }) => {
  return (
    <View style={styles.container}>
      {ECList.map((item, i) => (
        <View
          key={i}
          style={styles.item}
        >
          <TouchableOpacity onPress={() => {
            const recordID = item['recordID']
            onDel && onDel(recordID)
          }}>
            <Image style={styles.delIcon} source={require('../../images/icons/del-contact.png')} />
          </TouchableOpacity>
          <Text style={styles.itemTitle}>紧急联系人{i === 0 ? "一" : "二"}</Text>
          <Text style={styles.contactText}>{item.fullName || ''}{item.mobile || ''}</Text>
        </View>
      ))}
    </View>
  )
}

const proportion = 1.2
const styles = StyleSheet.create({
  container: {
  },
  item: {
    padding: p.td(10),
    height: p.td(90),
    paddingHorizontal: p.td(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: p.td(1),
  },
  itemTitle: {
    flex: 1,
    paddingLeft: p.td(20),
    color: '#4F5A6E',
    fontSize: p.td(32),
  },
  contactText: {
    color: '#4F5A6E',
    fontSize: p.td(30),
  },
  delIcon: {
    width: p.td(38),
    height: p.td(38),
  },
})
