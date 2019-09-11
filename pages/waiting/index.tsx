import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, ScrollView } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { device } from '@/utils/device'
import Header from '@/components/header'
import toast from '@/utils/toast'

export interface WaitingInterface extends NavigationTransitionProps {

}


export default class WaritingScreen extends Component<WaitingInterface, {}> {
  state = {
  }

  componentDidMount = () => {
  }


  // handleOnNextBtnPress = () => {
  //   const { navigation } = this.props
  //   navigation && navigation.navigate('BorrowConfirm')
  // }

  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'我的待还'} />

        <ScrollView style={styles.scroll_wraper}>
          <View style={{ height: 60, }}></View>


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