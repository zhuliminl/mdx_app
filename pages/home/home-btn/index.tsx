
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface HomeBtnInterface {

}


export default class HomeBtn extends Component<HomeBtnInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View>
        <Text>
          home-btn
        </Text>
      </View>
    )
  }
}
