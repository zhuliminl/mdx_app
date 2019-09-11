import React from 'react'
import { View, Image, Text, StatusBar, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { NavigationTransitionProps } from 'react-navigation'
import Header from '@/components/header'
import { device } from '@/utils/device'
import toast from '@/utils/toast'
import Accordion from 'react-native-collapsible/Accordion';

export interface OrderRecordsProps extends NavigationTransitionProps {
}

export interface OrderRecordsState {
}

const SECTIONS = [
  {
    item: {
      money: 200000,
      dateStr: '2018年10月09日',
      status: '审核中',
    },
    detail: [
      {
        stage: '第1期',
        deadline: '2019年10月1日',
        return_plan: 30,
      },
      {
        stage: '第2期',
        deadline: '2019年10月1日',
        return_plan: 30,
      },
      {
        stage: '第3期',
        deadline: '2019年10月1日',
        return_plan: 30,
      },
    ]
  },
  {
    item: {
      money: 200000,
      dateStr: '2018年10月09日',
      status: '审核中',
    },
    detail: [
      {
        stage: '第1期',
        deadline: '2019年10月1日',
        return_plan: 30,
      },
      {
        stage: '第2期',
        deadline: '2019年10月1日',
        return_plan: 30,
      },
      {
        stage: '第3期',
        deadline: '2019年10月1日',
        return_plan: 30,
      },
    ]
  },
]

class OrderRecordsScreen extends React.Component<OrderRecordsProps, OrderRecordsState> {
  state = {
    activeSections: [],
  };

  // _renderSectionTitle = (section: any) => {
  //   return (
  //     <View style={styles.content}>

  //       <Text>xxxxxxxx</Text>
  //     </View>
  //   )
  // }

  _renderHeader = (section: any, index: number, isActive: boolean) => {
    const { item = {} } = section
    let activeStyle = {
      transform: [{ rotateZ: '90deg' }, { scale: 0.8 }]
    }
    return (
      <View style={styles.header_wraper}>
        <View style={styles.header_left_wraper}>
          <Text style={styles.header_money}>{item['money']}</Text>
          <Text style={styles.header_date_txt}>{item['dateStr']}</Text>
        </View>

        <View style={styles.header_right_wraper}>
          <Text style={styles.header_right_status_txt}>{item['status']}</Text>
          {/* <Text style={styles.header_date_txt}>2018年</Text> */}
        </View>
        <View style={styles.header_right_arrow}>
          <Image
            style={[styles.arrow_grey, isActive ? activeStyle : {}]}
            source={require('../../images/icons/arrow-dblue.png')} />
        </View>
      </View>
    )
  }

  _renderContent = (section: any) => {
    const { detail = [] } = section
    return (
      <View style={styles.content_wraper}>
        <View style={styles.content_header_wraper} >
          <Text style={styles.content_header_txt}>期数</Text>
          <Text style={styles.content_header_txt}>应还时间</Text>
          <Text style={styles.content_header_txt}>当前还款计划</Text>
        </View>
        {
          detail && detail.map((item: any, i: number) => {
            return (
              <View style={styles.content_item_wraper} key={i}>
                <Text style={styles.content_item_txt}>{item['stage']}</Text>
                <Text style={styles.content_item_txt}>{item['deadline']}</Text>
                <Text style={styles.content_item_txt}>{item['return_plan']}元</Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  _updateSections = (activeSections: any) => {
    this.setState({ activeSections })
  }

  render() {
    return (
      <View style={styles.wraper}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Header title={'我的借款记录'} />

        <ScrollView style={styles.scroll_wraper}>
          <View style={{ height: 60, }}></View>

          <Accordion
            sections={SECTIONS}
            underlayColor={'#FFF'}
            activeSections={this.state.activeSections}
            // renderSectionTitle={this._renderSectionTitle}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
          />


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
    backgroundColor: '#FFF',

  },
  header_wraper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: device.width,
    paddingHorizontal: 10,
    // height: 100,
    borderTopWidth: 1,
    borderTopColor: '#F5F6F7',
    paddingVertical: 5,

  },
  header_left_wraper: {
    flexDirection: 'column',
    flex: 1,
  },
  header_money: {
    marginBottom: 4,
    fontSize: 18,
    color: '#000000',
  },
  header_date_txt: {
    fontSize: 13,
    color: '#4F5A6E',

  },
  header_right_wraper: {
    flexDirection: 'column',
    paddingVertical: 8,

  },
  header_right_status_txt: {
    marginRight: 5,
    marginBottom: 4,
    fontSize: 14,
    color: '#737577',
  },
  header_right_arrow: {
    // width: 10,
    // height: 10,
    // backgroundColor: 'red',
  },
  arrow_grey: {
    width: 16 * 0.5,
    height: 26 * 0.5,
  },


  content_wraper: {
    width: device.width,
    flexDirection: 'column',
  },
  // 标题头
  content_header_wraper: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content_header_txt: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // 内容
  content_item_wraper: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content_item_txt: {
    color: '#4F5A6E',
    fontSize: 14,
  },

})

export default OrderRecordsScreen