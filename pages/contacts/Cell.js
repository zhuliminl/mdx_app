import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { p } from "../../utils/p";

const okOn = require('../../images/icons/contact-ok-on.png');
const okOff = require('../../images/icons/contact-ok-off.png');

const ITEM_HEITHT = 50

class Cell extends React.Component {
  render() {
    const { item, title, isSelected, index } = this.props
    const name = item['fullName']

    // console.log('Cell Props', this.props)
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.props.onPress && this.props.onPress({ title, index, recordID: item.recordID })
        }}
      >
        <Image
          style={styles.itemIcon}
          source={isSelected ? okOn : okOff} />
        <Text style={styles.itemText}>{name}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    // paddingVertical: p.td(30),
    backgroundColor: '#FFF',
    paddingLeft: p.td(33),
    borderBottomWidth: 1,
    alignItems: 'center',
    borderBottomColor: '#F5F6F7',
    flexDirection: 'row',
    height: ITEM_HEITHT,
  },
  itemIcon: {
    // position: 'relative',
    width: p.td(36),
    height: p.td(36),
  },
  itemText: {
    marginLeft: p.td(10),
    fontSize: p.td(34),
    color: '#333',
  },
})

export default Cell
