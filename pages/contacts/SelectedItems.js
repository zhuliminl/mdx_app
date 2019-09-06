import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { p } from "../../utils/p";

class SelectedItems extends React.Component {
  render() {
    const { items } = this.props

    if (items.length === 0) return null

    return (
      <View style={styles.itemContainer}>
        {
          items.map((item, i) => {
            return (
              <TouchableOpacity
                key={item.recordID}
                style={styles.item}
                onPress={() => {
                  this.props.onPress && this.props.onPress(item.recordID)
                }}
              >
                <Text style={styles.itemText}>
                  {item.fullName || ''}
                </Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: p.td(10),
    flexDirection: 'row',
    marginLeft: p.td(30),
  },
  item: {
    marginRight: p.td(10),
    padding: p.td(10),
    paddingHorizontal: p.td(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#ddd',
    borderWidth: p.td(2),
    borderRadius: p.td(34),
  },
  itemIcon: {
  },
  itemText: {
    fontSize: p.td(28),
    color: '#4F5A6E'
  },
})

export default SelectedItems
