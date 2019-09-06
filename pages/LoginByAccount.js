import React from "react";
import { AsyncStorage, Image, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Loading from "../cpns/small/Loading";
import api from '../utils/api';
import Config from '../utils/nativeConfig';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
import Treaty from './common/Treaty';



export default class LoginByAccount extends React.Component {
  componentDidMount = () => {
    const { navigation } = this.props;
    const mobile = navigation.getParam('mobile', '');
    const onRefresh = navigation.getParam('onRefresh', () => { });

    this.setState({
      mobile
    })
  }

  handleGoBack = () => {
    const { navigation } = this.props;
    const { mobile } = this.state;
    const onRefresh = navigation.getParam('onRefresh', () => { });
    navigation.goBack();
    onRefresh(mobile);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <TouchableOpacity style={[styles.bo, this.props.style]} onPress={() => {
            Keyboard.dismiss();
            this.handleGoBack()
          }}>
            <Image
              style={styles.icon}
              source={require('../images/icons/back-white.png')}
            />
            <Text style={styles.text}>返回</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.passwordLoginBtn}
            onPress={() => { this.handleGoBack() }}
          >
            <Text style={styles.passwordLoginText}>短信登录</Text>
          </TouchableOpacity>

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
                placeholderTextColor='#969696' />

              {this.state.showMobileClear &&
                <TouchableOpacity onPress={() => { this.clearText('mobile') }} style={styles.clearBtn}>
                  <Image style={styles.clearBtnIcon} source={require('../images/icons/clear-grey.png')} />
                </TouchableOpacity>}
            </View>

            <View style={[styles.inputArea, styles.inputAreaCode]}>
              <Image style={[styles.inputIcon, styles.inputIconCode]} source={require('../images/icons/lock-grey.png')} />
              <TextInput style={styles.input}
                autoCapitalize="none"
                onChangeText={password => {
                  this.setState({
                    password,
                  })
                  if (password !== "") {
                    this.showClearIcon('password')
                  }
                }}
                value={this.state.password}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                returnKeyType='next'
                placeholder='请输入6-15位密码'
                secureTextEntry={!this.state.showPassword}
                returnKeyLabel='下一步'
                maxLength={16}
                selectionColor={tm.mainColor}
                placeholderTextColor='#969696' />
              {
                this.state.showPasswordClear &&
                <TouchableOpacity onPress={() => { this.clearText('password') }} style={styles.clearBtnForPassword}>
                  <Image style={styles.clearBtnForPasswordIcon} source={require('../images/icons/clear-grey.png')} />
                </TouchableOpacity>
              }
              <TouchableOpacity onPress={() => { this.toggleEyes() }} style={styles.clearBtn}>
                {this.state.showPassword &&
                  <Image style={[styles.clearBtnIcon, styles.clearBtnIconForEyesOpen]} source={require('../images/icons/eyes-open.png')} />
                }
              </TouchableOpacity>
              {!this.state.showPassword &&
                <TouchableOpacity onPress={() => { this.toggleEyes() }} style={styles.eyesClosedBtn}>
                  {/*
                <Image style={[styles.clearBtnIcon, styles.clearBtnIconForEyesClose]} source={require('../images/icons/eyes-close.png')}/>
                    */}
                  <Image style={styles.eyesClosedIcon} source={require('../images/icons/eyes-close.png')} />
                </TouchableOpacity>
              }
            </View>
          </View>

          <TouchableOpacity disabled={!(this.state.mobile && this.state.mobile.length === 11 && this.state.password && this.state.password.length > 5 && this.state.password.length < 17)}
            style={styles.logupBtnOuter}
            onPress={() => { this.doLogin() }}>
            <Text style={[styles.logupBtnText, this.state.mobile && this.state.mobile.length === 11 && this.state.password && this.state.password.length > 5 && this.state.password.length < 17 ? {} : styles.logupBtnTextDisabled]}>
              登录
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
          <Loading show={this.state.showLoading} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      mobile: null,
      password: null,
      showLoading: false,
      showMobileClear: false,
      showPasswordClear: false,
      showPassword: false,
    };
  }

  // 清除当前输入
  clearText = (tag) => {
    if (tag === 'mobile') {
      return this.setState({ mobile: '', showMobileClear: false, })
    }
    if (tag === 'password') {
      console.log('tag ', tag)
      return this.setState({ password: '', showPasswordClear: false, })
    }
  }

  showClearIcon = tag => {
    if (tag === 'mobile') {
      return this.setState({ showMobileClear: true })
    }
    if (tag === 'password') {
      return this.setState({ showPasswordClear: true })
    }
  }

  // 密码显示开关
  toggleEyes = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    })
  }


  showLoading() {
    this.setState({ showLoading: true })
  }

  hideLoading() {
    this.setState({ showLoading: false });
  }

  async doLogin() {
    this.showLoading();
    const resp = await api.post('/users/login', { mobile: this.state.mobile, password: this.state.password });

    this.hideLoading();
    if (resp['success'] === true) {
      Toast('登录成功')
      await AsyncStorage.setItem('mobile', this.state.mobile);
      this.props.navigation.navigate({ routeName: 'Home', params: { statusName: 'login', params: true } });
    }

  }
}

const isAndroid = Platform.OS !== 'ios'

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: 'green',
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

  passwordLoginBtn: {
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
  passwordLoginText: {
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
  logupBtnTextDisabled: {
    color: '#bbb'
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
  logupBtnText: {
    top: p.td(20),
    height: p.td(56),
    color: tm.mainColor,
    lineHeight: p.td(56),
    textAlign: 'center',
    fontSize: p.td(36),
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
    height: p.td(48),
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
  eyesClosedBtn: {
    position: 'absolute',
    right: p.td(50),
    top: p.td(34),
    width: p.td(25) + 10,
    height: p.td(25) + 10,
  },
  eyesClosedIcon: {
    top: p.td(10),
    height: p.td(18),
    width: p.td(36),
  },
  clearBtnForPassword: {
    position: 'absolute',
    right: p.td(155),
    top: p.td(32),
    width: p.td(25) + 10,
    height: p.td(25) + 10,
  },
  clearBtnForPasswordIcon: {
    width: p.td(25),
    height: p.td(25),
    top: p.td(7),
  },
  clearBtnIconForPassword: {
    right: p.td(105),
  },
  clearBtnIconForEyesOpen: {
    height: p.td(26),
    width: p.td(36),
  },
  clearBtnIconForEyesClose: {
    top: p.td(40),
    height: p.td(18),
    width: p.td(36),
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
    top: 0
  },
  inputAreaCode: {
    // top: p.td(430)
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
  bo: {
    height: p.td(88),
    width: p.td(144),
    position: 'absolute',
    //backgroundColor: '#000',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    left: 0,
    top: p.td(isAndroid ? 10 : 72),
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
    fontSize: p.td(32),
    lineHeight: p.td(88),
    color: '#fff',
    position: 'absolute',
    left: p.td(56)
  }


});
