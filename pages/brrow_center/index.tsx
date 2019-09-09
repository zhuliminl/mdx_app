import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native'
import { device } from '@/utils/device'
import Header from '@/components/header'

export interface HomeBgInterface {

}


export default class BrrowCenter extends Component<HomeBgInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'借款'} />
        <View style={{height: 60,}}></View>
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