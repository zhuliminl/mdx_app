
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { OrderStatus } from '@/utils/AppEnum'
import { device } from '@/utils/device'

export interface OrderStatusBannerInterface {
  status: string;
  data: any;// 逾期费用和时间
}


export default class OrderStatusBanner extends Component<OrderStatusBannerInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { status } = this.props
    if (status === OrderStatus.closed) {
      return (<View><Text>已结清，不展示</Text></View>)
    }

    if (status === OrderStatus.waiting) {
      return (
        <View style={styles.waiting_wraper}>
          <Image style={styles.waiting_img} source={require('../../../images/waiting_red_bg.png')} />
          <Text style={styles.title_txt}>待还款</Text>
        </View>
      )
    }
    if (status === OrderStatus.overdue) {
      return (
        <View style={styles.overdue_wraper}>
          <Image style={styles.overdue_img} source={require('../../../images/overdue_red_bg.png')} />
          <Text style={styles.title_txt}>已逾期</Text>
          <View style={styles.overdue_detail_wraper}>
            <View style={styles.overdue_detail_date_wraper}>
              <Text style={styles.overdue_detail_title_txt}>逾期时间</Text>
              <Text style={styles.overdue_detail_content_txt}>7天</Text>
            </View>
            <View style={styles.overdue_detail_money_wraper}>
              <Text style={styles.overdue_detail_title_txt}>逾期费用</Text>
              <Text style={styles.overdue_detail_content_txt}>888元</Text>
            </View>
          </View>
        </View>
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
  title_txt: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
    // backgroundColor: '#999',
  },
  // 待还款
  waiting_wraper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: device.width,
    height: device.width * 142 / 749,
  },
  waiting_img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: device.width,
    height: device.width * 142 / 749,
  },
  // 已逾期
  overdue_wraper: {
    position: 'relative',
    flexDirection: 'column',
    width: device.width,
    height: device.width * 264 / 749,
  },
  overdue_img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: device.width,
    height: device.width * 264 / 749,
  },
  overdue_detail_wraper: {
    width: device.width,
    // height: 200,
    flexDirection: 'row',
  },
  overdue_detail_date_wraper: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',

  },
  overdue_detail_money_wraper: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',

  },
  overdue_detail_title_txt: {
    color: '#FFF',
    opacity: 0.8,
    fontSize: 13,
    marginBottom: 10,
  },
  overdue_detail_content_txt: {
    color: '#FFF',
    fontSize: 18,
  },


})
