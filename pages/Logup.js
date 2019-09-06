import React from "react";
import { Animated, AsyncStorage, Easing, Image, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import Loading from '../cpns/small/Loading';
import api from '../utils/api';
import codeTimer from '../utils/codeTimer';
import Config from '../utils/nativeConfig';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
import Treaty from './common/Treaty';
import LoginByAccount from "./LoginByAccount";


class Logup extends React.Component {

  onRefresh = (mobile) => {
    this.setState({
      mobile
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.containerInner}>
          <TouchableOpacity style={[styles.bo,]} onPress={() => {
            Keyboard.dismiss();
            this.props.navigation.pop()
          }}>
            <Image
              style={styles.icon}
              source={require('../images/icons/back-white.png')}
            />
            <Text style={styles.text}>返回</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smsLoginBtn}
            onPress={() => {
              this.goLoginByAccount()
              // this.props.navigation.navigate('UpdateModal')
            }}
          >
            <Text style={styles.smsLoginText}>密码登录</Text>
            {/* <Text style={styles.pageTitle}>注册/登录</Text> */}
          </TouchableOpacity>

          <View style={styles.remarkArea}>
            <Text style={styles.remarkText}>*短信首次登录将自动注册</Text>
          </View>

          {/* 登录输入框 */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputArea, styles.inputAreaPhone]}>
              <Image style={styles.inputIcon} source={require('../images/icons/mobile-grey.png')} />
              <TextInput autoFocus={true}
                style={styles.input}
                autoCapitalize="none"
                onChangeText={mobile => {
                  this.setState({
                    mobile,
                  })
                  if (mobile !== "") {
                    this.showClearIcon('mobile')
                  }
                }}
                value={this.state.mobile}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                placeholder='请输入您的手机号码'
                returnKeyLabel='下一步'
                keyboardType='number-pad'
                maxLength={11}
                returnKeyType='next'
                selectionColor={tm.mainColor}
                ref={ip => this.ipMobile = ip}
                placeholderTextColor='#969696' />

              {this.state.showMobileClear &&
                <TouchableOpacity onPress={() => { this.clearText('mobile') }} style={styles.clearBtn}>
                  <Image style={styles.clearBtnIcon} source={require('../images/icons/clear-grey.png')} />
                </TouchableOpacity>}
            </View>

            <View style={[styles.inputArea, styles.inputAreaCode]}>
              <Image style={[styles.inputIcon, styles.inputIconCode]} source={require('../images/icons/code-grey.png')} />
              <TextInput style={styles.input}
                autoCapitalize="none"
                onChangeText={code => {
                  this.setState({
                    code,
                  })
                  if (code !== "") {
                    this.showClearIcon('code')
                  }
                }}
                value={this.state.code}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                returnKeyType='next'
                placeholder='验证码'
                returnKeyLabel='下一步'
                keyboardType='number-pad'
                maxLength={4}
                selectionColor={tm.mainColor}
                ref={ip => this.ipCode = ip}
                placeholderTextColor='#969696' />

              {this.state.showCodeClear &&
                <TouchableOpacity onPress={() => { this.clearText('code') }} style={[styles.clearBtn, styles.clearBtnIconForCode]}>
                  <Image style={[styles.clearBtnIcon]} source={require('../images/icons/clear-grey.png')} />
                </TouchableOpacity>}


              <TouchableOpacity disabled={!(this.state.mobile && this.state.mobile.length === 11)} style={styles.getCodeBtn} onPress={() => { this.getCode() }}>
                <Text style={[styles.getCodeBtnText, !(this.state.mobile && this.state.mobile.length === 11) ? styles.logupBtnTextDisabled : {}]}>{this.state.getCodeBtnText}</Text>
              </TouchableOpacity>
            </View>
          </View>


          <TouchableOpacity disabled={!(this.state.code && this.state.code.length === 4 && this.state.mobile && this.state.mobile.length === 11)}
            style={styles.logupBtnOuter}
            onPress={() => { this.doLogin() }}>
            <Text style={[styles.logupBtnText, !(this.state.code && this.state.code.length === 4 && this.state.mobile && this.state.mobile.length === 11) ? styles.logupBtnTextDisabled : {}]}>
              注册/登录
            </Text>
          </TouchableOpacity>

          {/* 条款协议入口 */}
          <Treaty
            version={Config.versionName}
            onPress={() => {
              this.props.navigation.push('PWViewer', { r: { name: 'Logup' } })
            }}
          />


          {/* <Image style={styles.bottomBg} source={require('../images/red-home-header-bg.png')}/> */}

          <Loading show={this.state.showLoading} text={'正在登录中...'} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  constructor(props) {
    console.log('~~');
    super(props);
    this.state = {
      showLoading: false,
      showMobileClear: false,
      showCodeClear: false,
      code: null,
      mobile: null,
      getCodeBtnText: '获取验证码',
      timerOk: true
    };
  }

  // 清除当前输入
  clearText = (tag) => {
    if (tag === 'mobile') {
      return this.setState({ mobile: '', showMobileClear: false, })
    }
    if (tag === 'code') {
      return this.setState({ code: '', showCodeClear: false, })
    }
  }

  showClearIcon = tag => {
    if (tag === 'mobile') {
      return this.setState({ showMobileClear: true })
    }
    if (tag === 'code') {
      return this.setState({ showCodeClear: true })
    }
  }

  goLoginByAccount() {
    this.props.navigation.push('LoginByAccount', { mobile: this.state.mobile, onRefresh: this.onRefresh });
  }

  showLoading() {
    this.setState({ showLoading: true })
  }

  hideLoading() {
    this.setState({ showLoading: false });
  }

  async getCode() {
    if (this.state.getCodeBtnText !== '获取验证码') return Toast(this.state.getCodeBtnText);
    this.showLoading();
    const resp = await api.post('/users/code', { mobile: this.state.mobile });
    if (resp['success'] === true) Toast('获取验证码成功');
    this.hideLoading();
    if (resp['success'] === true) {
      this.ipCode.focus();
      await codeTimer((s) => {
        if (!this.state.timerOk) return;
        this.setState({ getCodeBtnText: `${s}s重新获取` });
      }, () => {
        if (!this.state.timerOk) return;
        this.setState({ getCodeBtnText: '获取验证码' });
      }, 60);
    } else {
      this.ipMobile.focus();
    }

  }

  componentWillUnmount() {
    this.setState({ timerOk: false });
  }

  async doLogin() {
    this.showLoading();

    const resp = await api.post('/users/login/code', { mobile: this.state.mobile, code: this.state.code });
    this.hideLoading();
    if (resp['success'] === true) {
      Toast('登录成功')
      await AsyncStorage.setItem('mobile', this.state.mobile);
      this.props.navigation.navigate({ routeName: 'Home', params: { statusName: 'login', params: true } });
    }
  }
}

export default createStackNavigator(
  {
    Logup: {
      screen: Logup
    },
    LoginByAccount: {
      screen: LoginByAccount,
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Logup',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateX }] };
      },
    })
  });

const isAndroid = Platform.OS !== 'ios'

const styles = StyleSheet.create({
  remarkArea: {
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'center',
    top: 105,
    left: 25,
    zIndex: 4
  },
  remarkText: {
    fontSize: p.td(28),
    opacity: 0.8,
    color: '#fff',
  },
  smsLoginBtn: {
    height: p.td(88),
    width: p.td(200),
    position: 'absolute',
    // backgroundColor: '#000',
    alignItems: 'flex-start',
    justifyContent: 'center',
    color: '#fff',
    right: 0,
    top: p.td(isAndroid ? 10 : 72),
    zIndex: 3
  },
  smsLoginText: {
    fontSize: p.td(36),
    color: '#fff',
  },
  pageTitle: {
    height: p.td(88),
    width: p.td(750),
    position: 'absolute',
    //backgroundColor: '#000',
    fontSize: p.td(36),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    left: 0,
    top: p.td(92),
    zIndex: 3
  },
  loginByAccount: {
    width: p.td(750),
    height: p.td(42),
    position: 'absolute',
    left: 0,
    bottom: p.td(254)
  },
  loginByAccountText: {
    width: p.td(750),
    height: p.td(42),
    lineHeight: p.td(42),
    color: '#fff',
    textAlign: 'center',
    fontSize: p.td(30),
    textDecorationLine: 'underline',
  },
  loginBtnWraper: {
    height: p.td(30),
    backgroundColor: '#FFF',
    zIndex: 11
  },
  logupBtnText: {
    top: p.td(20),
    height: p.td(56),
    color: tm.mainColor,
    lineHeight: p.td(56),
    textAlign: 'center',
    fontSize: p.td(36),
  },
  logupBtnTextDisabled: {
    color: '#bbb'
  },
  logupBtnOuter: {
    width: p.td(643),
    height: p.td(100),
    backgroundColor: '#fff',
    borderRadius: p.td(15),
    position: 'absolute',
    top: p.td(550),
    left: p.td(50),
  },
  inputIcon: {
    width: p.td(40),
    height: p.td(46),
    position: 'absolute',
    left: p.td(34),
    top: p.td(23)
  },
  inputIconCode: {
    width: p.td(35),
    height: p.td(40),
    left: p.td(38),
    top: p.td(26)
  },
  clearBtn: {
    width: p.td(25) + 10,
    height: p.td(25) + 10,
    position: 'absolute',
    right: p.td(50),
    top: p.td(34)
  },
  clearBtnIcon: {
    width: p.td(25),
    height: p.td(25),
  },
  clearBtnIconForCode: {
    right: p.td(250),
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
  inputWrapper: {
    top: p.td(280),
    left: p.td(50),
    height: p.td(215),
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: p.td(15),
  },
  inputArea: {
    width: p.td(640),
    height: p.td(100),
    top: p.td(2)
  },
  inputAreaPhone: {
    borderBottomWidth: 1,
    borderColor: '#EEE',
    marginTop: p.td(10),
  },
  inputAreaCode: {
    // borderBottomWidth: 0,
  },
  input: {
    width: p.td(434),
    height: p.td(92),
    position: 'absolute',
    top: 0,
    left: p.td(90),
    fontSize: p.td(32),
    color: '#000',
    borderWidth: 0,
    //lineHeight: p.td(92)
    textAlignVertical: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 0, paddingBottom: 0
  },
  container: {
    width: p.td(750),
    backgroundColor: tm.mainColor,
    position: 'relative',
    height: p.h,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInner: {
    width: p.td(750),
    backgroundColor: tm.mainColor,
    position: 'relative',
    height: p.h,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBg: {
    width: p.td(750),
    height: p.td(250),
    position: 'absolute',
    left: 0,
    bottom: -p.td(36),
    zIndex: 1
  },
  bo: {
    height: p.td(88),
    width: p.td(144),
    position: 'absolute',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    left: 0,
    top: p.td(isAndroid ? 10 : 70),
    zIndex: 5
  },
  icon: {
    position: 'absolute',
    left: p.td(20),
    bottom: p.td(28),
    width: p.td(32),
    height: p.td(32)
  },
  text: {
    fontSize: p.td(34),
    lineHeight: p.td(88),
    color: '#fff',
    position: 'absolute',
    left: p.td(56)
  },
});
