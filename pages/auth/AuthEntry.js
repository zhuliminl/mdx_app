import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { p } from "../../utils/p";
import Toast from '../../utils/toast';

const authStatusEnum = {
  UNFINISHED: 'unFinished',
  FINISHED: 'finished',
  ONPROCESS: 'onProcess',
}

export default ({ title, status, onPress }) => {

  let RightView = null
  if (status === authStatusEnum.UNFINISHED) {
    RightView = (
      <View>
        <Image style={styles.arrowIcon} source={require('../../images/icons/arrow-dblue.png')} />
      </View>
    )
  }
  if (status === authStatusEnum.FINISHED) {
    RightView = (
      <View style={styles.itemOk}>
        <Image style={styles.iconOk} source={require('../../images/icons/ok.png')} />
        <Text style={styles.okText}>完善</Text>
      </View>
    )
  }
  if (status === authStatusEnum.ONPROCESS) {
    RightView = (
      <View>
        <Text style={styles.onprocessText}>认证中...</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (status === authStatusEnum.FINISHED) {
          return Toast('您已经完成该认证')
        }
        if (status === authStatusEnum.ONPROCESS) {
          return Toast('正在认证请稍候重试')
        }
        onPress && onPress()
      }}>
      <Text style={styles.itemText}>{title}</Text>
      {RightView}
    </TouchableOpacity>
  )
}

const proportion = 0.2
const styles = StyleSheet.create({
  container: {
    padding: p.td(10),
    height: p.td(90),
    paddingHorizontal: p.td(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: p.td(1),
  },
  itemText: {
    color: '#4F5A6E',
    fontSize: p.td(32),
  },
  itemOk: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: p.td(300),
  },
  arrowIcon: {
    width: p.td(16),
    height: p.td(26),
  },
  iconOk: {
    width: p.td(164) * proportion,
    height: p.td(164) * proportion,
    marginRight: p.td(14),
  },
  okText: {
    color: '#87D068',
    fontSize: p.td(30),
  },
  onprocessText: {
    color: '#87D068',
    fontSize: p.td(30),
  }
})
