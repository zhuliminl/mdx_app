
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device'
import toast from '@/utils/toast'

export interface BorrowingLimitCardInterface {
  // 可用额度
  limitNumber: number;
  // 额度提升
  leftNumber: number;
  onGotoBorrowBtnPress: () => void;

}


export default class BorrowingLimitCard extends Component<BorrowingLimitCardInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { limitNumber = 0, leftNumber = 0, onGotoBorrowBtnPress } = this.props
    return (
      <View style={styles.wraper}>
        <Text style={styles.title}> 可用额度(元) </Text>
        <Text style={styles.money}>{limitNumber}</Text>
        <View style={styles.desc_wraper}>
          <Text style={styles.desc_txt}>您的额度提升了{leftNumber}元</Text>
          <TouchableOpacity style={styles.btn_wraper} onPress={() => {
            onGotoBorrowBtnPress && onGotoBorrowBtnPress()
          }}>
            <Text style={styles.btn_txt}>去借款</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wraper: {
    marginTop: 100,
    width: device.width - 20,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,

  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  money: {
    marginTop: 20,
    color: '#333',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'DIN-Bold',
  },
  desc_wraper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  desc_txt: {
    color: '#333',
    fontSize: 14,
  },
  btn_wraper: {
    backgroundColor: '#E73939',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 6,
  },
  btn_txt: {
    color: '#FFF',
    fontSize: 14,
  }
})