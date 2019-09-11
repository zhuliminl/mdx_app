import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import { device } from '@/utils/device'
import Header from '@/components/header'
import toast from '@/utils/toast'
import OrderStatusBanner from './order-status-banner'
import StageHeader from './stage-header'
import StageCard from './stage-card'
import OrderDetail from './order-detail'

import { OrderStatus, StageStatus } from '@/utils/AppEnum'


export interface WaitingInterface extends NavigationTransitionProps {

}

export interface StageItemInterface {
  stage: string;
  isOffline: boolean;
  deadline: string;
  status: StageStatus;
  money_return_plan: number;
  money_return_left: number;
  isSelected: boolean;
}


const stageData = [
  {
    stage: '第1期',
    isOffline: true,
    deadline: '2018-09-04',
    status: StageStatus.closed,
    money_return_plan: 200,
    money_return_left: 100,
    isSelected: true,
  },
  {
    stage: '第2期',
    isOffline: false,
    deadline: '2018-09-04',
    status: StageStatus.overdue,
    money_return_plan: 200,
    money_return_left: 100,
    isSelected: false,
  },
  {
    stage: '第3期',
    isOffline: false,
    deadline: '2018-09-04',
    status: StageStatus.waiting,
    money_return_plan: 200,
    money_return_left: 100,
    isSelected: false,
  },
]


export default class WaitingScreen extends Component<WaitingInterface, {}> {
  state = {
  }

  componentDidMount = () => {
  }



  handleOnConfirmBtnPress = () => {

  }

  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'我的待还'} />

        <ScrollView style={styles.scroll_wraper}>
          <View style={{ height: 60, }}></View>
          {/* 订单状态 */}
          <OrderStatusBanner
            // status={OrderStatus.closed}
            status={OrderStatus.overdue}
            // status={OrderStatus.waiting}
            data={{ dateCount: 7, cost: 888 }}
          />
          <StageHeader statgeNumber={3} />
          {
            stageData && stageData.map((stageItem, i) => {
              return (
                <StageCard data={stageItem} key={i} />
              )
            })
          }

          <Text style={styles.notice_txt}>提醒：确认后不可取消该借款。为了您能积累良好的信用记录，请提前做好资金安排，以免逾期产生的不良后果。</Text>
          <TouchableOpacity style={styles.confirm_btn} onPress={this.handleOnConfirmBtnPress}>
            <Text style={styles.confirm_btn_txt}>还款</Text>
          </TouchableOpacity>

          <OrderDetail />

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
    // backgroundColor: '#FFF',
    backgroundColor: '#F5F6F7',
  },
  notice_txt: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
    paddingHorizontal: 20,
    alignSelf: 'center',

  },
  confirm_btn: {
    backgroundColor: '#E73939',
    flexDirection: 'row',
    width: 160,
    height: 46,
    borderRadius: 23,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,

  },
  confirm_btn_txt: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',

  }
})