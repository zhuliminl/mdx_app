
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { device } from '@/utils/device'

export interface SloganInterface {
  title: string;
  subTitle: string;
}


export default class Slogan extends Component<SloganInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View style={styles.wraper}>
        <Text style={styles.sub_title}>
          {this.props.subTitle}
        </Text>
        <Text style={styles.title}>
          {this.props.title}
        </Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wraper: {
    width: device.width,
    height: 100,
    flexDirection: 'column',
    alignItems: 'center',
  },
  sub_title: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 6,

  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
})