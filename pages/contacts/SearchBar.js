import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { p } from "../../utils/p";


class SearchBar extends React.Component {

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
        }}
      >
        <Text style={styles.placeholderText}>搜索</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: '#F5f6f7',
    borderTopWidth: 1,
    paddingVertical: p.td(15),
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  placeholderText: {
    textAlign: 'center',
    lineHeight: p.td(60),
    fontSize: p.td(32),
    color: '#666',
  },
})

export default SearchBar
