
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface ReturnPlanInterface {
  wraperStyle?: any;
}


export default class ReturnPlan extends Component<ReturnPlanInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { wraperStyle } = this.props
    return (
      <View style={[styles.wraper, wraperStyle]} >
        <View style={styles.divide_line}></View>
        <Text style={styles.title_txt}>还款计划</Text>

        <View style={styles.table_header_wraper}>
          <Text style={styles.table_header_txt}>期数</Text>
          <Text style={styles.table_header_txt}>还款时间</Text>
          <Text style={styles.table_header_txt}>还款金额</Text>
        </View>
        {
          [1, 2, 3].map((item, i) => {
            return (
              <View style={styles.table_item_wraper} key={i}>
                <Text style={styles.table_item_txt}>第1期</Text>
                <Text style={styles.table_item_txt}>2019年10月1日</Text>
                <Text style={styles.table_item_txt}>50元</Text>
              </View>
            )
          })
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  divide_line: {
    width: 200,
    height: 1,
    backgroundColor: '#333',
  },
  title_txt: {
    width: 100,
    // backgroundColor: '#999',
    color: '#333',
    backgroundColor: '#FFF',
    fontSize: 14,
    position: 'relative',
    top: -10,
    textAlign: 'center',
  },

  table_header_wraper: {
    paddingHorizontal: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,

  },
  table_header_txt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',

  },
  table_item_wraper: {
    paddingHorizontal: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // justifyContent: 'space-around',
    marginBottom: 10,

  },
  table_item_txt: {
    fontSize: 14,
    color: '#4F5A6E',
    textAlign: 'center',
  },
})
