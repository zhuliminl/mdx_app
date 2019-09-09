
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface SloganInterface {

}


export default class Slogan extends Component<SloganInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    return (
      <View>
        <Text>
          slogan
        </Text>
      </View>
    )
  }
}
