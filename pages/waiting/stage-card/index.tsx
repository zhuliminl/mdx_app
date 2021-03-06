
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Popover from 'react-native-popover-view'
import { StageItemInterface } from '../index'
import { device } from '@/utils/device'
import { StageStatus } from '@/utils/AppEnum'
import OfflinePopover from '../offline-popover'

export interface StageCardInterface {
  data: StageItemInterface;
  onSelect: () => void;
  onDetailPress: () => void;
  onOfflineBtnPress: () => void;
  // isSelected: boolean;
}


export default class StageCard extends Component<StageCardInterface, {}> {
  state = {
    showOfflineNotice: false,
  }

  handleOnOfflineBtnPress = () => {
    const { onOfflineBtnPress } = this.props
    onOfflineBtnPress && onOfflineBtnPress()

    this.setState({ showOfflineNotice: true })
  }

  onClosePopover = () => {
    this.setState({
      showOfflineNotice: false,
    })
  }

  componentDidMount = () => {
  }
  touchable: any

  render() {
    const { data = {} as StageItemInterface } = this.props
    const { isSelected = false, status, isOffline = false } = data

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
        <TouchableOpacity style={styles.card_top_wraper} onPress={() => {
          const { onSelect } = this.props
          onSelect && onSelect()
        }}>
          {/* 逾期宣章 */}
          {
            status === StageStatus.overdue &&
            <Image style={styles.card_overdue_badge_img} source={require('../../../images/icons/overdue_red.png')} />
          }
          {/* 单选 */}
          {
            isSelected ?
              <Image style={styles.card_selected_img} source={require('../../../images/icons/is_selected_red.png')} /> :
              <Image style={styles.card_unselected_img} source={require('../../../images/icons/unselected_grey.png')} />
          }
          <Text style={styles.card_top_stage_title_txt}>{data.stage}</Text>
          <Text style={styles.card_top_stage_date_txt}>应还时间{data.deadline}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card_bottom_wraper} onPress={() => {
          const { onDetailPress } = this.props
          onDetailPress && onDetailPress()
        }}>
          {
            isOffline ?
              (
                <View style={styles.offline_wraper}>
                  <TouchableOpacity
                    ref={ref => this.touchable = ref as any}
                    style={styles.offline_btn_wraper}
                    onPress={this.handleOnOfflineBtnPress}
                  >
                    <Image style={styles.question_img} source={require('../../../images/icons/question_white.png')} />
                    <Text style={styles.offline_txt}>该期需线下还款</Text>
                    {/* 弹窗 */}
                    <Popover
                      popoverStyle={{
                        opacity: 0.9,
                      }}
                      isVisible={this.state.showOfflineNotice}
                      fromView={this.touchable}
                      arrowStyle={{
                        backgroundColor: '#00099',
                      }}
                      displayArea={{
                        x: -21,
                        y: -100,
                        width: device.width - 20,
                        height: 100,
                      }}
                      mode={'tooltip'}
                    >
                      <OfflinePopover
                        serviceTel={'13735881684'}
                        onClosePopover={this.onClosePopover}
                      />
                    </Popover>
                  </TouchableOpacity>
                </View>
              ) :
              (
                <>
                  <Text style={styles.card_bottom_plan_title_txt}>计划还款:</Text>
                  <Text style={styles.card_bottom_plan_money_txt}>{data.money_return_plan}元</Text>
                </>
              )
          }
          <Text style={[styles.card_bottom_plan_desc_txt, status === StageStatus.overdue ? warningStyle : {}]}>{descStr}</Text>
          <Image style={styles.card_arrow_img} source={require('../../../images/icons/arrow-dblue.png')} />
        </TouchableOpacity>
      </View >
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
    width: 40,
    height: 40,
    right: 5,
    top: -30,

  },
  card_arrow_img: {
    width: 16 * 0.4,
    height: 26 * 0.4,
    marginLeft: 10,
    marginRight: 20,
  },
  offline_wraper: {
    flex: 1,
  },
  offline_btn_wraper: {
    width: 170,
    marginLeft: 20,
    flexDirection: 'row',
    backgroundColor: '#F99F2A',
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  question_img: {
    width: 14,
    height: 14,
    marginRight: 10,
    marginLeft: 10,
  },
  offline_txt: {
    opacity: 0.9,
    fontSize: 15,
    color: '#FFF',
  }

})
