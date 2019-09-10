
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device'
import toast from '@/utils/toast'
import ReturnPlan from '@/components/return-plan'

export interface BillInterface {
  onNextBtnPress: () => void;
}


export default class Bill extends Component<BillInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { onNextBtnPress } = this.props
    return (
      <View style={styles.wraper} >
        <View style={styles.wraper_inner}>

          {/* 头部 */}
          <View style={styles.header_wraper}>
            <View style={styles.header_left_wraper}>
              <Text style={styles.title_txt}>借款单</Text>
              <View style={styles.money_wraper}>
                <Text style={styles.money_symbol}>￥</Text>
                <Text style={styles.money_txt}>2000</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.next_step_btn}
              onPress={() => {
                onNextBtnPress && onNextBtnPress()
              }}
            >
              <Text style={styles.next_step_btn_txt}>选好了，下一步</Text>
            </TouchableOpacity>
          </View>
          {/* 综合费用开始 */}
          <View style={styles.deadline_item_wraper}>
            <Text style={styles.deadline_item_txt}>综合费用： 200.00元</Text>
            <Text style={styles.deadline_item_txt}>借款期限： 7天</Text>
          </View>
          <View style={styles.deadline_item_wraper}>
            <Text style={styles.deadline_item_txt}>到账金额：1800.00元</Text>
            <Text style={styles.deadline_item_txt}>分期期限： 3天</Text>
          </View>
          {/* 还款计划 */}
          <ReturnPlan />

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    marginTop: 30,
    paddingTop: 20,
    width: device.width,
    flexDirection: 'row',
    backgroundColor: '#F5F6F7',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  wraper_inner: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderRadius: 10,
    width: device.width - 20,
    backgroundColor: '#FFF',
  },

  header_wraper: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  header_left_wraper: {
    flexDirection: 'column',
  },

  title_txt: {
    color: '#E73939',
    fontSize: 18,
  },
  money_wraper: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  money_symbol: {
    fontSize: 14,
    color: '#333',
    position: 'relative',
    top: -3,
  },
  money_txt: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'DIN-Bold'
  },

  next_step_btn: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E73939',
  },
  next_step_btn_txt: {
    fontSize: 16,
    color: '#FFF',
  },

  deadline_item_wraper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deadline_item_txt: {
    fontSize: 14,
    color: '#4F5A6E',
  }


})
