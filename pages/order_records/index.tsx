import React from 'react'
import { View, Image, Text, StatusBar, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import Header from '@/components/header'
import { device } from '@/utils/device'
import toast from '@/utils/toast'

export interface OrderRecordsProps extends NavigationTransitionProps {
}

export interface OrderRecordsState {
}

class OrderRecordsScreen extends React.Component<OrderRecordsProps, OrderRecordsState> {
  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'我的借款记录'} />

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

export default OrderRecordsScreen