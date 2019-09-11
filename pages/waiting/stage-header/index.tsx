
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { device } from '@/utils/device'

export interface StageHeaderInterface {
  statgeNumber: number;
}


export default class StageHeader extends Component<StageHeaderInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { statgeNumber } = this.props
    return (
      <View style={styles.wraper} >
        <Image style={styles.money_img} source={require('../../../images/icons/money_red.png')} />
        <Text style={styles.header_txt}>分期期限：{statgeNumber}期 </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    marginTop: 20,
    marginBottom: 10,
    width: device.width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  money_img: {
    width: 32 * 0.6,
    height: 32 * 0.6,
    marginRight: 10,
  },
  header_txt: {
    color: '#000',
    fontSize: 16,
  },
})
