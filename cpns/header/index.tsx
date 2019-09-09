
import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { tm } from '@/utils/theme'
import { device } from '@/utils/device'
import toast from '@/utils/toast'
const { icons } = tm

export interface HeaderInterface {
  onBack?: () => void;
  title: string;
}


class Header extends Component<HeaderInterface & NavigationInjectedProps, {}> {

  componentDidMount = () => {
  }

  render() {
    const { onBack, title = '标题', navigation } = this.props
    return (
      <View
        style={styles.wraper}
      >
        <TouchableOpacity
          style={styles.back_btn_wraper}
          onPress={() => {
            // toast('返回')
            onBack && onBack()
            navigation && navigation.goBack()
          }}
        >
          <Image
            style={styles.back_icon}
            source={icons.back}
          />
          <Text style={styles.back_txt}>返回</Text>
        </TouchableOpacity>

        <Text style={styles.title_txt}>
          {title}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wraper: {
    zIndex: 999,
    position: 'absolute',
    top: 0,
    width: device.width,
    height: 60,
    backgroundColor: '#FFF',
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,

    borderBottomColor: '#F5F6F7',
    borderBottomWidth: 1,

  },

  back_btn_wraper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  back_icon: {
    width: 16,
    height: 16,
  },
  back_txt: {
    fontSize: 15,
    color: tm['mainColor']
  },
  title_txt: {
    marginRight: 50,
    flexDirection: 'row',
    textAlign: 'center',
    flex: 1,
    fontSize: 17,
    color: '#4F5A6E',
  },
})

export default withNavigation(Header)