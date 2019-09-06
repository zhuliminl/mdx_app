import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { p } from "../../utils/p";


export default ({ onPress, isActive }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        isActive && onPress && onPress()
      }}
      style={{
        marginTop: p.td(40),
        backgroundColor: isActive ? '#e73939' : '#CCC',
        borderRadius: p.td(20),
        height: p.td(100),
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: p.td(300),
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          alignItems: 'center',
          fontSize: p.td(38),
          color: isActive ? '#FFF' : '#4F5A6E'
        }}
      >确定</Text>
    </TouchableOpacity>
  )
}

