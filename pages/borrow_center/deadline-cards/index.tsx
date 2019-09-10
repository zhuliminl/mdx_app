import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { tm } from '@/utils/theme'
const { icons } = tm

export interface DeadlineCardsInterface {
  borrowDeadline: number;
  amortizationDeadline: number;
}

export interface ItemInterface {
  title: string;
  dateStr: string;
}

const Item = (props: ItemInterface) => {
  const { title, dateStr } = props
  return (
    <View style={styles.item_wraper}>
      <Image style={styles.borrow_card_bg} source={icons['borrowCardBg']} />
      <Text style={styles.item_title}>{title}</Text>
      <Text style={styles.item_date_txt}>{dateStr}</Text>
    </View>
  )
}

export default class DeadlineCards extends Component<DeadlineCardsInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { borrowDeadline, amortizationDeadline } = this.props
    return (
      <View style={styles.wraper} >
        <Item title='选择借款期限' dateStr={`借${borrowDeadline}天`} />
        <Item title='选择分期期限' dateStr={`分${amortizationDeadline}天`} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
  },
  item_wraper: {
    marginTop: 20,
    alignSelf: 'center',
    position: 'relative',
    width: 320,
    height: 320 * 306 / 1278,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: '#999',
  },
  borrow_card_bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 320,
    height: 320 * 306 / 1278,
  },
  item_title: {
    fontSize: 20,
    color: tm['mainColor'],
  },
  item_date_txt: {
    fontSize: 20,
    color: tm['mainColor'],
  },
})
