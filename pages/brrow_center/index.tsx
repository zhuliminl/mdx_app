import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, ScrollView } from 'react-native'
import { device } from '@/utils/device'
import Header from '@/components/header'
import MoneySlider from './money-slider'

export interface BrrowCenterInterface {

}


export default class BrrowCenter extends Component<BrrowCenterInterface, {}> {
  state = {
    money_number: 2000,
  }

  componentDidMount = () => {
  }

  handleOnSliderChange = () => {

  }

  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'借款'} />
        <ScrollView
          style={styles.scroll_wraper}
        >
          <View style={{ height: 60, }}></View>

          <MoneySlider
            money_number={this.state.money_number}
            onSliderChange={this.handleOnSliderChange}
          />

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    width: device.width,
    height: device.height,
  },
  scroll_wraper: {
    width: device.width,
    height: device.height,
    backgroundColor: '#FFF',

  },
})