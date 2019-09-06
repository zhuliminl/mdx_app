import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import api from '../utils/api';
import codeTimer from '../utils/codeTimer';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
import SupportedBanks from "./SupportedBanks";

const cardIcon = {
  red: require('../images/icons/red/card.png'),
  blue: require('../images/icons/blue/card.png'),
  green: require('../images/icons/green/card.png')
};

const getCardIcon = () => {
  return cardIcon[p.tn];
};

class AddBankCard extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '银行卡认证'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      showSB: false,
      cardNumber: null,
      mobile: null,
      code: null,
      showLoading: false,
      getCodeBtnText: '获取验证码',
      trx_id: null
    };

  }

  componentDidMount() {
    this.props.navigation.setParams({
      reBack: () => {
        this.props.navigation.navigate('AuthenticationCenter', { r: { statusName: 'bankCard', status: false } })
      }
    });
  }

  async goNext() {
    this.setState({ showLoading: true });
    if (this.state.tokenData) {
      const resp = await api.post('/users/auth/bank/bind', {
        code: this.state.code,
        mobile: this.state.mobile,
        cardNumber: this.state.cardNumber,
        trx_id: this.state.trx_id,
        token: this.state.tokenData.token,
      });
      this.setState({ showLoading: false });
      if (resp['success'] === true) {
        Toast('绑定银行卡成功');
        this.props.navigation.navigate('AuthenticationCenter', {
          r: {
            status: true,
            statusName: 'bankCard'
          }
        })
      }
    } else {
      Toast('没有 tokenData')
    }
  }

  async getCode() {
    this.setState({ showLoading: true });
    const params = { mobile: this.state.mobile, cardNumber: this.state.cardNumber };
    if (this.state.trx_id) {
      params['trx_id'] = this.state.trx_id;
    }
    const resp = await api.post('/users/auth/bank/code', params);
    this.setState({ showLoading: false });
    if (resp['success'] === true) {
      Toast('验证码获取成功')
      this.setState({ trx_id: resp['trx_id'] });
      const tokenData = resp['data']
      if (tokenData) {
        this.setState({ tokenData })
      }
      await codeTimer((s) => {
        //this.ipCode.focus();
        this.setState({ getCodeBtnText: `${s}s重新获取` });
      }, () => {
        this.setState({ getCodeBtnText: '获取验证码' });
      }, 60);
    }
  }

  render() {
    return (

      <ScrollView keyboardShouldPersistTaps='handled' style={styles.container} contentContainerStyle={styles.containerC}>
        <View style={styles.inputArea}>
          <Text style={styles.iTitle}>银行卡号</Text>
          <TextInput style={styles.input}
            autoCapitalize="none"
            onChangeText={(cardNumber) => this.setState({ cardNumber })}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            returnKeyType='next'
            placeholderTextColor='#969696'
            selectionColor={tm.mainColor}
            placeholder='请输入银行卡号码'
            maxLength={19}
            multiline={false}
            returnKeyLabel='下一步'
            keyboardType='number-pad' />
          <TouchableOpacity style={styles.cardIconOuter} onPress={() => {
            this.setState({ showSB: true })
          }}>
            <Image style={styles.cardIcon} source={getCardIcon()} />
          </TouchableOpacity>

        </View>
        <View style={styles.inputArea}>
          <Text style={styles.iTitle}>预留手机</Text>
          <TextInput style={styles.input}
            autoCapitalize="none"
            onChangeText={(mobile) => this.setState({ mobile })}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            returnKeyType='next'
            placeholderTextColor='#969696'
            selectionColor={tm.mainColor}
            placeholder='请输入银行预留手机号码'
            returnKeyLabel='下一步'
            maxLength={11}
            multiline={false}
            keyboardType='number-pad' />
        </View>
        <View style={styles.inputArea}>
          <Text style={[styles.iTitle, styles.iTitle3]}>验证码</Text>
          <TextInput style={styles.input}
            autoCapitalize="none"
            onChangeText={(code) => this.setState({ code })}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            returnKeyType='next'
            placeholderTextColor='#969696'
            selectionColor={tm.mainColor}
            //ref={ip => this.ipCode = ip}
            placeholder='请输入验证码'
            returnKeyLabel='下一步'
            maxLength={6}
            multiline={false}
            keyboardType='number-pad' />
          <TouchableOpacity
            disabled={!(this.state.mobile && this.state.mobile.length === 11 && this.state.cardNumber && this.state.cardNumber.length >= 16)}
            style={[styles.getCodeBtn]}
            onPress={() => { this.getCode() }}>
            <Text style={[styles.getCodeBtnText, !(this.state.mobile && this.state.mobile.length === 11 && this.state.cardNumber && this.state.cardNumber.length >= 16) ? styles.getCodeBtnDisabled : []]}>{this.state.getCodeBtnText}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.notice}>为了保障您的资金安全，基于同卡进出原则，该收款与还款银行卡为同一张银行卡。</Text>

        <RedBtn disabled={!(this.state.mobile && this.state.mobile.length === 11 && this.state.cardNumber && this.state.cardNumber.length >= 16 && this.state.code && this.state.code.length === 6)} style={styles.goNextSure} title='下一步' show={true} onPress={() => {
          this.goNext()
        }} />

        <SupportedBanks show={this.state.showSB} doHide={() => {
          this.setState({ showSB: false })
        }} />
        <Loading show={this.state.showLoading} />
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  goNextSure: {
    width: p.td(300),
    position: 'absolute',
    left: p.td(226),
    top: p.td(460)
  },
  notice: {
    fontSize: p.td(30),
    color: '#4F5A6E',
    position: 'absolute',
    top: p.td(292),
    width: p.td(700),
    textAlign: 'center',
    left: p.td(25),
    lineHeight: p.td(44)
  },
  getCodeBtn: {
    height: p.td(92),
    width: p.td(192),
    backgroundColor: 'transparent',
    position: 'absolute',
    right: p.td(30),
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getCodeBtnText: {
    color: tm.mainColor,
    fontSize: p.td(32),
    textAlign: 'right',
  },
  getCodeBtnDisabled: {
    color: '#bbb',
  },
  cardIconOuter: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: p.td(128),
    height: p.td(92)
  },
  cardIcon: {
    width: p.td(50),
    height: p.td(50),
    position: 'absolute',
    right: p.td(32),
    top: p.td(21)
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },

  containerC: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  inputArea: {
    width: p.td(750),
    height: p.td(92),
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iTitle: {
    //height: p.td(92),
    paddingLeft: p.td(30),
    //lineHeight:p.td(92),
    color: '#4F5A6E',
    fontSize: p.td(34),
    width: p.td(230),
    flexDirection: 'row',
  },
  iTitle3: {
    letterSpacing: p.td(14)
  },
  input: {
    width: p.td(444),
    color: '#000',
    fontSize: p.td(32),
    //lineHeight: p.td(92),
    height: p.td(92),
    position: 'absolute',
    top: 0,
    left: p.td(246),
    borderWidth: 0,
    paddingTop: 0, paddingBottom: 0
  }

});
export default createStackNavigator({
  AddBankCard: {
    screen: AddBankCard
  }
}, {
  initialRouteName: 'AddBankCard',
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
