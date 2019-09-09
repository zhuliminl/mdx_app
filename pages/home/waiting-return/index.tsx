
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface WaitingReturnInterface {

}


export default class WaitingReturn extends Component<WaitingReturnInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View>
        <Text>
          waiting-return
        </Text>
      </View>
    )
  }
}
