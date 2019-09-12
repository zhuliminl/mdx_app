
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device';
import toast from '@/utils/toast';

export interface OfflinePopoverInterface {
  serviceTel: string;
  onClosePopover: () => void;
}


export default class OfflinePopover extends Component<OfflinePopoverInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { serviceTel = '9138-40000' } = this.props
    return (
      <View style={styles.wraper} >
        <TouchableOpacity onPress={() => {
          const { onClosePopover } = this.props
          onClosePopover && onClosePopover()
        }}>
          <Image style={styles.close_img} source={require('../../../images/icons/close_white.png')} />
        </TouchableOpacity>
        <Text style={styles.notice_txt}> 如需继续还款请联系客服: </Text>
        <TouchableOpacity onPress={() => {
          toast('打电话')
        }}>
          <Text style={styles.notice_txt_red}>  {serviceTel} </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    width: device.width - 20,
    height: 60,
    alignItems: 'center',
    backgroundColor: '#000',
    flexDirection: 'row',

  },
  close_img: {
    width: 12,
    height: 12,
    marginHorizontal: 20,
  },
  notice_txt: {
    fontSize: 14,
    color: '#FFF',
  },
  notice_txt_red: {
    fontSize: 14,
    color: '#E73939',
  },
})
