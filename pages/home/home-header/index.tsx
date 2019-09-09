import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { device } from '@/utils/device'

export interface HomeHeaderInterface {
  onLeftClick: () => void;
  onRightClick: () => void;
}


export default class HomeHeader extends Component<HomeHeaderInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { onLeftClick, onRightClick } = this.props
    return (
      <View style={styles.wraper}>
        <TouchableOpacity
          style={styles.btn_right}
          onPress={() => {
            onLeftClick && onLeftClick()
          }}>
          <Image style={styles.btn_right_img} source={require('../../../images/icons/my.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn_left}
          onPress={() => {
            onRightClick && onRightClick()
          }}>
          <Image style={styles.btn_left_img} source={require('../../../images/icons/msg.png')} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    flexDirection: 'row',
    width: device.width,
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingHorizontal: 10,

  },
  btn_left: {
  },
  btn_left_img: {
    width: 24,
    height: 24,
  },
  btn_right: {
  },
  btn_right_img: {
    width: 24,
    height: 24,
  },

})