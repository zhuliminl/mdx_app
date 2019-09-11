
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device'

export interface OrderDetailInterface {

}

const Cell = (props: any) => {
  const { title = '', content = '' } = props
  return (
    <View style={styles.cell_wraper}>
      <Text style={styles.cell_title_txt}>{title}</Text>
      <Text style={styles.cell_content_txt}>{content}</Text>
    </View>
  )
}


export default class OrderDetail extends Component<OrderDetailInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View style={styles.wraper} >
        <Cell title={'借款金额'} content={'2000元'} />
        <Cell title={'还款总金额'} content={'200元'} />
        <Cell title={'综合费用'} content={'200元'} />
        <Cell title={'滞纳金'} content={'200元'} />
        <Cell title={'借款天数'} content={'7天'} />
        <Cell title={'分期期限'} content={'3天期'} />
        <Cell title={'还款账户'} content={'中国银行(2362)'} />
        <TouchableOpacity style={styles.contract_btn_wraper}>
          <Text style={styles.contract_txt}>查看合同协议</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    backgroundColor: '#FFF',
    borderTopColor: '#DDDDDD',
    borderTopWidth: 0.5,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 0.5,
    marginBottom: 30,
  },
  cell_wraper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: device.width,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cell_title_txt: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  cell_content_txt: {
    fontSize: 14,
    color: '#333'
  },

  contract_btn_wraper: {
    marginTop: 30,
    marginBottom: 30,
  },
  contract_txt: {
    fontSize: 14,
    color: '#E73939',
    textAlign: 'center',
  }
})
