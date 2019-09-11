
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modalbox';
import { device } from '@/utils/device';

export interface DetailModalInterface {
  data: any;
  isShow: boolean;
  onConfirmBtnPress: () => void;
}


export default class DetailModal extends Component<DetailModalInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View
        style={styles.wraper}
      >
        <Modal
          backButtonClose
          coverScreen
          isOpen={this.props.isShow}
          style={{
            height: 500,
            width: 300,
            backgroundColor: '#FFF',
            borderRadius: 10,
            overflow: 'hidden',
            // justifyContent: 'center',
            // alignItems: 'center'
          }}
        // swipeToClose={}
        // onClosed={this.onClose}
        // onOpened={this.onOpen}
        // onClosingState={this.onClosingState}
        >
          <View style={styles.header_wraper}>
            <Text style={styles.header_txt}>查看详情</Text>
          </View>
          <View style={styles.table_header_wraper}>
            <Text style={styles.table_header_txt}>期数</Text>
            <Text style={styles.table_header_txt}>第一期</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>应还时间</Text>
            <Text style={styles.table_content_txt}>2019年10月1日</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>逾期天数</Text>
            <Text style={styles.table_content_txt}>4天</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>当前还款计划</Text>
            <Text style={styles.table_content_txt}>200元</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>应还总金额</Text>
            <Text style={styles.table_content_txt}>200元</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>已还金额</Text>
            <Text style={styles.table_content_txt}>200元</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>滞纳金</Text>
            <Text style={styles.table_content_txt}>200元</Text>
          </View>
          <View style={styles.table_content_wraper}>
            <Text style={styles.table_content_txt}>剩余待还</Text>
            <Text style={styles.table_content_txt}>200元</Text>
          </View>
          <View style={
            [styles.table_content_wraper,
            { flex: 1, }
            ]
          }>
            <Text style={styles.table_content_txt}>状态</Text>
            <Text style={styles.table_content_txt}>逾期未结清</Text>
          </View>
          <TouchableOpacity
            style={styles.confirm_wraper}
            onPress={() => {
              const { onConfirmBtnPress } = this.props
              onConfirmBtnPress && onConfirmBtnPress()
            }}
          >
            <Text style={styles.confirm_txt}>确认</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    // width: device.width,
    // height: device.height,
  },
  header_wraper: {
    height: 50,
    backgroundColor: '#F5F6F7',
    width: '100%',
  },
  header_txt: {
    fontSize: 18,
    color: '#000',
    // fontWeight: 'bold',
    marginVertical: 16,
    alignSelf: 'center',
    textAlign: 'center',
    // height: 40,
  },
  table_header_wraper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  table_header_txt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  table_content_wraper: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  table_content_txt: {
    fontSize: 14,
    color: '#4F5A6E',
  },
  confirm_wraper: {
    height: 50,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#F5F6F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirm_txt: {
    width: '100%',
    fontSize: 18,
    color: '#E73939',
    fontWeight: 'bold',
    marginVertical: 16,
    alignSelf: 'center',
    textAlign: 'center',

  },
})
