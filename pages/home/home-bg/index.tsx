
import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { device } from '@/utils/device'

export interface HomeBgInterface {

}


export default class HomeBg extends Component<HomeBgInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View
        style={styles.wraper}
      >
        <Image
          style={styles.img}
          source={require('../../../images/banner/banner1.png')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    zIndex: -999,
    position: 'absolute',
    width: device.width,
    height: 300,
    backgroundColor: '#E73939',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 200,
    height: 200,
  }
})