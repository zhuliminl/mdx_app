import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, ScrollView } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { device } from '@/utils/device'
import Header from '@/components/header'
import MoneySlider from './money-slider'
import DeadlineCards from './deadline-cards'
import Bill from './bill'
import toast from '@/utils/toast'

export interface BorrowCenterInterface extends NavigationTransitionProps {

}


export default class BorrowCenter extends Component<BorrowCenterInterface, {}> {
  state = {
    money_number: 2000,
  }

  componentDidMount = () => {
  }

  handleOnSliderChange = () => {

  }

  handleOnNextBtnPress = () => {
    const { navigation } = this.props
    navigation && navigation.navigate('BorrowConfirm')
  }

  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'借款'} />

        <ScrollView style={styles.scroll_wraper}>
          <View style={{ height: 60, }}></View>

          {/* 金额选择器 */}
          <MoneySlider
            money_number={this.state.money_number}
            onSliderChange={this.handleOnSliderChange}
          />
          {/* 时间期限 */}
          <DeadlineCards
            borrowDeadline={7}
            amortizationDeadline={4}
          />

          {/* 账单下一步 */}
          <Bill onNextBtnPress={this.handleOnNextBtnPress} />

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