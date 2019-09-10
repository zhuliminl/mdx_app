
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Slider from "react-native-slider";
import { tm } from '@/utils/theme'
import { device } from '@/utils/device';

export interface MoneySliderInterface {
  onSliderChange: () => void;
  money_number: number;
}


export default class MoneySlider extends Component<MoneySliderInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { onSliderChange, money_number = 0 } = this.props
    return (
      <View
        style={styles.wraper}
      >
        <Text style={styles.title}>
          选择借款金额(元)
        </Text>
        <Text style={styles.money_txt}>
          {money_number}
        </Text>

        {/* 后期需要结合 api 配置数据来修改加以调整 */}
        <Slider
          // value={money_number}
          value={150}
          step={4}
          style={styles.slider}
          trackStyle={styles.sliderTrackStyle}
          thumbStyle={styles.sliderThumbStyle}
          minimumValue={20}
          maximumValue={300}
          minimumTrackTintColor={'#E73939'}
          // thumbTintColor={'red'}
          maximumTrackTintColor='#D8D8D8'
          onValueChange={(value: number) => {
          }}
        />


      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  money_txt: {
    marginTop: 20,
    color: '#E73939',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'DIN-Bold',
  },
  slider: {
    height: 60,
    width: device.width - 100,
    // backgroundColor: '#999',

  },
  sliderTrackStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',

  },
  sliderThumbStyle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#E73939',
    borderWidth: 2,

  },
})
