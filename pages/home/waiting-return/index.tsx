
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device'

export interface WaitingReturnInterface {

}


export default class WaitingReturn extends Component<WaitingReturnInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View style={styles.wraper}>
        <View style={styles.left_wraper}>
          <Text style={styles.date_txt}>2018年10月9日</Text>
          <View style={styles.money_wraper}>
            <Text style={styles.money_txt}>20,000</Text>
            <Text style={styles.money_yuan_txt}>元</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btn_wraper}
        >
          <Text style={styles.btn_txt}>待还款</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    width: device.width - 20,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left_wraper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  date_txt: {
    color: '#999',
    fontSize: 13,
  },
  money_wraper: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  money_txt: {
    color: '#E73939',
    fontSize: 24,
    fontWeight: 'bold',
  },
  money_yuan_txt: {
    color: '#E73939',
    fontSize: 14,
    fontWeight: 'bold',

  },
  btn_wraper: {
    borderRadius: 4,
    borderColor: '#E73939',
    borderWidth: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  btn_txt: {
    color: '#E73939',
    fontSize: 14,
  }
})
