
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device'

export interface HomeBtnInterface {
  onUpgradeBtnPress: () => void;
  onReturnBtnPress: () => void;
}


export default class HomeBtn extends Component<HomeBtnInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { onUpgradeBtnPress, onReturnBtnPress } = this.props
    return (
      <View style={styles.wraper}>
        <TouchableOpacity style={styles.upgrade_btn} onPress={() => {
          onUpgradeBtnPress && onUpgradeBtnPress()
        }}>
          <Text style={styles.upgrade_txt}>提额</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.return_btn} onPress={() => {
          onReturnBtnPress && onReturnBtnPress()
        }}>
          <Text style={styles.return_txt}>还款</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wraper: {
    marginTop: 20,
    width: device.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,

  },

  upgrade_btn: {
    height: 40,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF',
    borderRadius: 20,
    borderColor: '#E73939',
    borderWidth: 1,
  },
  upgrade_txt: {
    color: '#E73939',
    fontSize: 18,
  },

  return_btn: {
    height: 40,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 20,
    backgroundColor: '#E73939',
  },
  return_txt: {
    color: '#FFF',
    fontSize: 18,
  },
})