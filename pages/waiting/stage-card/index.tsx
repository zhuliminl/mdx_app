
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { StageItemInterface } from '../index'
import { device } from '@/utils/device'
import { StageStatus } from '@/utils/AppEnum'

export interface StageCardInterface {
  data: StageItemInterface;
  // isSelected: boolean;
}


export default class StageCard extends Component<StageCardInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { data = {} as StageItemInterface } = this.props
    const { isSelected = false, status } = data

    let descStr = '状态错误'
    if (status === StageStatus.closed) {
      descStr = '已结清'
    }
    if (status === StageStatus.overdue) {
      const { money_return_left = 0 } = data
      descStr = '逾期，剩余待还：' + money_return_left + '元'
    }
    if (status === StageStatus.waiting) {
      descStr = '未到期'
    }

    const activeStyle = {
      borderWidth: 1,
      borderColor: '#E73939',
    }

    const warningStyle = {
      color: '#E73939',
    }

    return (
      <View style={[styles.wraper, isSelected ? activeStyle : {}]} >
        <View style={styles.card_top_wraper}>
          {
            status === StageStatus.overdue &&
            <Image style={styles.card_overdue_badge_img} source={require('../../../images/icons/overdue_red.png')} />
          }
          {
            isSelected ?
              <Image style={styles.card_selected_img} source={require('../../../images/icons/is_selected_red.png')} /> :
              <Image style={styles.card_unselected_img} source={require('../../../images/icons/unselected_grey.png')} />
          }
          <Text style={styles.card_top_stage_title_txt}>{data.stage}</Text>
          <Text style={styles.card_top_stage_date_txt}>应还时间{data.deadline}</Text>
        </View>
        <View style={styles.card_bottom_wraper}>
          <Text style={styles.card_bottom_plan_title_txt}>计划还款:</Text>
          <Text style={styles.card_bottom_plan_money_txt}>{data.money_return_plan}元</Text>
          <Text style={[styles.card_bottom_plan_desc_txt, status === StageStatus.overdue ? warningStyle : {}]}>{descStr}</Text>
          <Image style={styles.card_arrow_img} source={require('../../../images/icons/arrow-dblue.png')} />
        </View>
      </View>
    )
  }
}


const selectWidth = 20
const styles = StyleSheet.create({
  wraper: {
    position: 'relative',
    width: device.width - 20,
    alignSelf: 'center',
    // height: 100,
    marginBottom: 15,
    // backgroundColor: '#999',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },

  // 卡片上
  card_top_wraper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',

  },
  card_top_stage_title_txt: {
    flex: 1,
    color: '#4F5A6E',
    fontSize: 14,

  },
  card_top_stage_date_txt: {
    marginRight: 20,
    color: '#4F5A6E',
    fontSize: 14,
  },

  // 卡片下
  card_bottom_wraper: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',

  },
  card_bottom_plan_title_txt: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 20,
  },
  card_bottom_plan_money_txt: {
    flex: 1,
    color: '#E73939',
    fontSize: 14,
  },
  card_bottom_plan_desc_txt: {
    // color: '#E73939',
    color: '#4F5A6E',
    fontSize: 14,

  },

  card_selected_img: {
    width: selectWidth,
    height: selectWidth,
    marginRight: 10,
    marginLeft: 20,
  },
  card_unselected_img: {
    width: selectWidth,
    height: selectWidth,
    marginRight: 10,
    marginLeft: 20,
  },
  card_overdue_badge_img: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 0,
    top: -40,
  },
  card_arrow_img: {
    width: 16 * 0.4,
    height: 26 * 0.4,
    marginLeft: 10,
    marginRight: 20,

  }
})
