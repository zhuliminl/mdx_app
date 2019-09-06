import PubSub from "pubsub-js";
import React from 'react';
import { AsyncStorage, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from "react-native-device-info/deviceinfo";
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import AnalyticsUtil from '../umeng/AnalyticsUtil';
import api from '../utils/api';
import { p } from "../utils/p";
import Toast from '../utils/toast';

const tan = require('../images/icons/tan.png');
const finished = require('../images/icons/finished.png');
const arrow = require('../images/icons/arrow-dblue.png');

class MyCenter extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '个人中心'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      mobile: null,
      showLoading: false,
      authStatus: false,
      hasPassword: false
    };
    AnalyticsUtil.onPageStart('个人中心');
  }

  componentWillUnmount() {
    if (this.sub) {
      PubSub.unsubscribe(this.sub);
    }
    AnalyticsUtil.onPageEnd('个人中心');
  }

  async getUserStatus() {
    await this.setState({ showLoading: true });
    const resp = await api.get('/users/status');
    this.setState({ mobile: await AsyncStorage.getItem('mobile') });

    if (resp['success'] === true && resp['ud_status'] === true && resp['carrier_status'] === true && resp['alipay_status'] === true && resp['bank_status'] === true && resp['emergency_contact_status'] === true) {
      await this.setState({ authStatus: true });
    }

    if (resp['success'] && resp['hasPassword'] === true) {
      await this.setState({ hasPassword: true });
    }

    await this.setState({ showLoading: false });
  }

  async componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
    this.getUserStatus();
    if (!this.sub) {
      this.sub = PubSub.subscribe('BACK_MY_CENTER', (msg, data) => {
        this.getUserStatus();
      });
    }
  }

  getAuth() {
    if (this.state.authStatus) {
      return (
        <View style={styles.itemRight}>
          <Image source={finished} style={[styles.unFinishedIcon, styles.finishedIcon]} />
          <Text style={[styles.itemRight, styles.unFinished, styles.finished]}>完善</Text>
        </View>
      );
    }

    return (
      <View style={styles.itemRight}>
        <Image source={tan} style={styles.unFinishedIcon} />
        <Text style={[styles.itemRight, styles.unFinished]}>未完善</Text>
      </View>
    );
  }

  goAuth() {
    if (this.state.authStatus) {
      return Toast('您的认证已完善');
    }
    AnalyticsUtil.onEvent('enter_my');
    this.props.navigation.push('AuthenticationCenter');
  }

  getPassOp() {
    if (this.state.hasPassword) {
      return (
        <TouchableOpacity style={styles.item} onPress={() => { this.goResetPassword() }}>
          <Text style={styles.itemTitle}>重置密码</Text>
          <Image source={arrow} style={styles.endArrow} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.item} onPress={() => { this.goSetPassword() }}>
        <Text style={styles.itemTitle}>设置密码</Text>
        <Image source={arrow} style={styles.endArrow} />
      </TouchableOpacity>
    );
  }

  goSetPassword() {
    this.props.navigation.push('SetPassword');
  }

  goResetPassword() {
    this.props.navigation.push('ResetPassword');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <TouchableOpacity style={styles.item} onPress={() => { this.goAuth() }}>
          <Text style={styles.itemTitle}>认证中心</Text>
          {this.getAuth()}
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemTitle}>绑定手机</Text>
          <Text style={[styles.itemRight, styles.mobile]}>{this.state.mobile ? this.state.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null}</Text>
        </TouchableOpacity>

        {this.getPassOp()}
        <RedBtn style={styles.logout} title='退出登录' show={true} onPress={() => { this.logout() }} />
        <Loading show={this.state.showLoading} />
      </View>
    );
  }

  async logout() {
    await AsyncStorage.clear();
    PubSub.publish('BACK_HOME', 'Logout');
    AnalyticsUtil.profileSignOff();


    const deviceInfo = {
      brand: DeviceInfo.getBrand(),
      bundleId: DeviceInfo.getBundleId(),
      carrier: DeviceInfo.getCarrier(),
      buildNumber: DeviceInfo.getBuildNumber(),
      deviceId: DeviceInfo.getDeviceId(),
      iPhone: Platform.OS === 'ios',
      android: Platform.OS !== 'ios',
      uniqueId: DeviceInfo.getUniqueID(),
      userAgent: DeviceInfo.getUserAgent(),
      version: DeviceInfo.getVersion(),
      isEmulator: DeviceInfo.isEmulator(),
      isTablet: DeviceInfo.isTablet(),
      systemVersion: DeviceInfo.getSystemVersion(),
      systemName: DeviceInfo.getSystemName(),
      mac: await DeviceInfo.getMACAddress(),
      manufacturer: DeviceInfo.getManufacturer()
    };

    await AsyncStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));

    this.props.navigation.navigate({ routeName: 'Home', params: { statusName: 'logout', params: true } });
  }

}


const styles = StyleSheet.create({
  finishedIcon: {
    right: p.td(68),
  },
  unFinishedIcon: {
    width: p.td(36),
    height: p.td(36),
    position: 'absolute',
    right: p.td(100),
    top: p.td(28)
  },
  finished: {
    color: '#87D068'
  },
  unFinished: {
    color: '#FF795F',
    fontSize: p.td(28),
    right: 0
  },
  mobile: {
    color: '#4F5A6E',
    fontSize: p.td(28)
  },
  itemRight: {
    height: p.td(92),
    lineHeight: p.td(92),
    position: 'absolute',
    right: p.td(32),
    top: 0
  },
  endArrow: {
    width: p.td(16),
    height: p.td(26),
    position: 'absolute',
    right: p.td(36),
    top: p.td(34)
  },
  itemTitle: {
    height: p.td(92),
    lineHeight: p.td(92),
    color: '#4F5A6E',
    fontSize: p.td(32),
    paddingLeft: p.td(30)
  },
  item: {
    height: p.td(94),
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(2),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: p.td(750),
    backgroundColor: '#fff',
    position: 'relative'
  },
  logout: {
    position: 'absolute',
    top: p.td(440),
    left: p.td(225),
    zIndex: 2,
    width: p.td(300)
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },

});
export default createStackNavigator({
  MyCenter: {
    screen: MyCenter
  }
}, {
  initialRouteName: 'MyCenter',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomColor: '#fff',
      elevation: 0,
      ...Platform.select({
        android: {
          // height: 56 + StatusBar.currentHeight,
          // paddingTop: StatusBar.currentHeight
        }
      }),
    },
    headerTitleStyle: {
      fontSize: p.td(36),
      color: '#4F5A6E'
    }
  }
});
