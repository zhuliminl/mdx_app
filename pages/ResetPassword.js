import PubSub from "pubsub-js";
import React from 'react';
import { AsyncStorage, Image, Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import api from '../utils/api';
import codeTimer from '../utils/codeTimer';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';

const eyesOpen = require('../images/icons/eyes-open.png');
const eyesClose = require('../images/icons/eyes-close.png');


class ResetPassword extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '重置密码'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      mobile: null,
      showLoading: false,
      eyesOpen: false,
      getCodeBtnText: '获取验证码',
      code: null,
      password: null
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
    //await this.setState({showLoading: true});
    this.setState({ mobile: await AsyncStorage.getItem('mobile') });


  }

  getEyes() {
    return this.state.eyesOpen ? eyesOpen : eyesClose;
  }

  async getCode() {
    if (this.state.getCodeBtnText !== '获取验证码') return Toast(this.state.getCodeBtnText);
    this.setState({ showLoading: true });
    const resp = await api.get('/users/set_password/code');
    this.setState({ showLoading: false });

    if (resp['success'] === true) {
      Toast('验证码获取成功')
      this.ipPassword.focus();
      await codeTimer((s) => {
        this.setState({ getCodeBtnText: `${s}s重新获取` });
      }, () => {
        this.setState({ getCodeBtnText: '获取验证码' });
      }, 60);
    }

  }

  getGoStatus() {
    return this.state.code && this.state.code.length === 4 && this.state.password && this.state.password.length > 5 && this.state.password.length < 17;
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <StatusBar hidden={false} barStyle="dark-content" />

          <View style={styles.item}>
            <Text style={styles.itemTitle}>绑定手机</Text>
            <Text style={[styles.itemRight, styles.mobile]}>{this.state.mobile ? this.state.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null}</Text>
          </View>

          <View style={styles.mobileItem}>
            <Text style={[styles.mobileTitle, { letterSpacing: p.td(16) }]}>验证码</Text>
            <TextInput style={styles.input}
              onChangeText={(code) => this.setState({ code })}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid='transparent'
              returnKeyType='next'
              placeholder='请输入验证码'
              returnKeyLabel='下一步'
              keyboardType='number-pad'
              maxLength={4}
              selectionColor={tm.mainColor}
              placeholderTextColor='#969696' />
            <TouchableOpacity style={styles.getCodeBtn} onPress={() => { this.getCode() }}>
              <Text style={styles.getCodeBtnText}>{this.state.getCodeBtnText}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mobileItem}>
            <Text style={[styles.mobileTitle, { letterSpacing: p.td(16) }]}>新密码</Text>
            <TextInput style={styles.input}
              autoCapitalize="none"
              onChangeText={(password) => this.setState({ password })}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              returnKeyType='next'
              placeholder='请输入6-16位密码'
              secureTextEntry={!this.state.eyesOpen}
              returnKeyLabel='下一步'
              maxLength={16}
              ref={ip => this.ipPassword = ip}
              selectionColor={tm.mainColor}
              placeholderTextColor='#969696' />
            <TouchableOpacity style={styles.eyesOuter} onPress={() => { this.setState({ eyesOpen: !this.state.eyesOpen }) }}>
              <Image source={this.getEyes()} style={[styles.eyes, this.state.eyesOpen ? styles.eyesOpen : styles.eyesClose]} />
            </TouchableOpacity>
          </View>

          <RedBtn disabled={!this.getGoStatus()} style={styles.logout} title='确定' show={true} onPress={() => { this.setPassword() }} />
          <Loading show={this.state.showLoading} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  async setPassword() {
    this.setState({ showLoading: true });
    const resp = await api.post('/users/set_password', {
      code: this.state.code,
      password: this.state.password
    });
    this.setState({ showLoading: false });
    if (resp['success'] === true) {
      Toast('重置密码成功');
      PubSub.publish('BACK_MY_CENTER', 'SetPassword');
      this.props.navigation.pop();
    }
  }
}


const styles = StyleSheet.create({
  eyesClose: {
    width: p.td(32),
    height: p.td(16),
    top: p.td(40)
  },
  eyesOpen: {
    width: p.td(33),
    height: p.td(24)
  },
  eyes: {
    position: 'absolute',
    right: p.td(44),
    top: p.td(34)
  },
  eyesOuter: {
    position: 'absolute',
    height: p.td(92),
    width: p.td(120),
    right: 0,
    top: 0
  },
  mobileTitle: {
    position: 'absolute',
    left: p.td(30),
    top: 0,
    lineHeight: p.td(92),
    color: '#4F5A6E',
    textAlign: 'left',
    fontSize: p.td(32),
  },
  mobileItem: {
    height: p.td(94),
    width: p.td(750),
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(2),
    backgroundColor: '#fff',
    position: 'relative'
  },
  getCodeBtn: {
    height: p.td(92),
    width: p.td(192),
    backgroundColor: 'transparent',
    position: 'absolute',
    right: p.td(30),
    top: 0
  },
  getCodeBtnText: {
    color: tm.mainColor,
    fontSize: p.td(32),
    lineHeight: p.td(92),
    textAlign: 'right',
    width: p.td(190),
    height: p.td(92),
    position: 'absolute',
    right: 0,
    top: 0,
  },
  input: {
    width: p.td(434),
    height: p.td(92),
    position: 'absolute',
    top: 0,
    left: p.td(246),
    fontSize: p.td(32),
    color: '#000',
    borderWidth: 0,
    //lineHeight: p.td(92)
    textAlignVertical: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 0, paddingBottom: 0
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
    backgroundColor: '#fff'
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
  ResetPassword: {
    screen: ResetPassword
  }
}, {
  initialRouteName: 'ResetPassword',
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
