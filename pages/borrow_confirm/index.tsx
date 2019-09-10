import React from 'react'
import { View, Image, Text, StatusBar, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import Header from '@/components/header'
import { device } from '@/utils/device'
import ReturnPlan from '@/components/return-plan'

export interface BorrowConfirmProps extends NavigationTransitionProps {
}

export interface BorrowConfirmState {
}

class BorrowConfirmScreen extends React.Component<BorrowConfirmProps, BorrowConfirmState> {
  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'借款确认'} />

        <ScrollView style={styles.scroll_wraper}>
          <View style={{ height: 60, }}></View>

          <View style={styles.bill_wraper}>
            <View style={styles.top_border_wraper}></View>
            <Text style={styles.title_txt}>借款金额</Text>
            <View style={styles.money_wraper}>
              <Text style={styles.money_symbol}>￥</Text>
              <Text style={styles.money_txt}>2000</Text>
            </View>

            <View style={styles.table_wraper}>
              <Text style={styles.table_item_txt}>到账金额：1800.00元</Text>
              <Text style={styles.table_item_txt}>综合费率：200.00元</Text>
              <Text style={styles.table_item_txt}>还款金额：2000.00元</Text>
              <Text style={styles.table_item_txt}>借款期限：7 天</Text>
              <Text style={styles.table_item_txt}>分期期限：3 天</Text>
              <Text style={styles.table_item_txt}>收款账户：中国银行（3750）</Text>
            </View>

            <ReturnPlan
              wraperStyle={{ paddingHorizontal: 20, }}
            />

            <TouchableOpacity style={styles.confirm_btn} >
              <Text style={styles.confirm_btn_txt}>确认</Text>
            </TouchableOpacity>

            <View style={styles.clause_hint_wraper}>
              <Text style={styles.clause_hint_txt_grey}>确认即表示同意</Text>
              <TouchableOpacity onPress={() => {

              }}>
                <Text style={styles.clause_hint_txt_red}>《xxxx借款协议》</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.notice_txt}>提醒：确认后不可取消该借款。为了您能积累良好的信用记录，请提前做好资金安排，以免逾期产生的不良后果。</Text>

          </View>
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
    backgroundColor: '#F5F6F7',
  },

  bill_wraper: {
    paddingBottom: 30,
    marginBottom: 30,
    flexDirection: 'column',
    borderRadius: 10,
    overflow: 'hidden',
    width: device.width - 20,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#FFF',

  },
  top_border_wraper: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#E73939',
    height: 10,
  },
  title_txt: {
    marginTop: 50,
    fontSize: 14,
    color: '#666',
    alignSelf: 'center',
    textAlign: 'center',
  },

  money_wraper: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'baseline',
  },
  money_txt: {
    fontSize: 34,
    color: '#333',
    fontFamily: 'DIN-Bold',
    fontWeight: 'bold',
  },
  money_symbol: {
    position: 'relative',
    top: Platform.OS === 'android' ? -6 : 0,
    fontSize: 14,
    color: '#333',
  },

  table_wraper: {
    paddingLeft: 100,
  },
  table_item_txt: {
    marginBottom: 10,
    fontSize: 14,
    color: '#4F5A6E',
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

  },
  clause_hint_wraper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,


  },
  clause_hint_txt_grey: {
    fontSize: 14,
    color: '#4F5A6E',

  },
  clause_hint_txt_red_wraper: {

  },
  clause_hint_txt_red: {
    fontSize: 14,
    color: '#E73939',

  },

  notice_txt: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },

})

export default BorrowConfirmScreen