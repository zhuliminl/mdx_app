import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { device } from '@/utils/device'

export interface HomeBgInterface {

}


export default class BrrowCenter extends Component<HomeBgInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View>
        <Text>借款中心</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    width: device.width,
    height: 340,
    backgroundColor: '#E73939',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  img: {
    width: 240,
    height: 240,
  }
})