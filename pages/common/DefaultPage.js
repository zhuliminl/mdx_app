/*
 * Created by Saul at 2019/05/28
 *
 * 缺省页
 *
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { p } from "../../utils/p";
import { tm } from '../../utils/theme';

const { icons } = tm

class DefaultPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={this.props.iconSource}
        />
        <Text style={styles.textContainer}>
          <Text style={{ color: '#666' }}>
            {this.props.message}
          </Text>
          <Text
            onPress={() => {
              this.props.onBack && this.props.onBack()
            }}
            style={{
              color: tm.mainColor,
              textDecorationLine: 'underline',
            }}
          >
            {this.props.actionName}
          </Text>
        </Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: p.h,
    backgroundColor: '#f5f6f7',
  },
  icon: {
    marginTop: p.td(200),
    marginBottom: p.td(160),
    alignSelf: 'center',
    height: p.td(90),
    width: p.td(90),
  },
  textContainer: {
    fontSize: p.td(30),
    alignSelf: 'center',
  },
  messageText: {
  },

})


export default DefaultPage;
