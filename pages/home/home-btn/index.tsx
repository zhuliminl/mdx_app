
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { device } from '@/utils/device'

export interface HomeBtnInterface {
  onUpgradeBtnPress: () => void;
  onReturnBtnPress: () => void;
  onLoginBtnPress: () => void;
  onAuthBtnPress: () => void;
  showStatus: number;
}


export default class HomeBtn extends Component<HomeBtnInterface, {}> {

  componentDidMount = () => {
  }

  render() {
    const { showStatus, onUpgradeBtnPress, onReturnBtnPress, onAuthBtnPress, onLoginBtnPress } = this.props
    if (showStatus === 0) {
      return (
        <View style={styles.wraper}>
          <TouchableOpacity style={styles.red_btn} onPress={() => {
            onLoginBtnPress && onLoginBtnPress()
          }}>
            <Text style={styles.login_txt}>立即登录</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if (showStatus === 1) {
      return (
        <View style={styles.wraper}>
          <TouchableOpacity style={styles.red_btn} onPress={() => {
            onAuthBtnPress && onAuthBtnPress()
          }}>
            <Text style={styles.login_txt}>立即激活</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if (showStatus === 3) {
      return (
        <View style={styles.wraper}>
          <TouchableOpacity style={styles.upgrade_btn} onPress={() => {
            onUpgradeBtnPress && onUpgradeBtnPress()
          }}>
            <Text style={styles.upgrade_txt}>提额</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.return_btn} onPress={() => {
            onReturnBtnPress && onReturnBtnPress()
          }}>
            <Text style={styles.return_txt}>还款</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}


const styles = StyleSheet.create({
  wraper: {
    marginTop: 20,
    width: device.width,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  red_btn: {
    height: 40,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#E73939',
  },
  login_txt: {
    color: '#FFF',
    fontSize: 18,
  },

  upgrade_btn: {
    height: 40,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,

    backgroundColor: '#FFF',
    borderRadius: 20,
    borderColor: '#E73939',
    borderWidth: 1,
  },
  upgrade_txt: {
    color: '#E73939',
    fontSize: 18,
  },

  return_btn: {
    height: 40,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,

    borderRadius: 20,
    backgroundColor: '#E73939',
  },
  return_txt: {
    color: '#FFF',
    fontSize: 18,
  },
})