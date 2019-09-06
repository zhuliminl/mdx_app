import React from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import BackFailed from "../cpns/BackFailed";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from '../cpns/small/RedBtn';
import api from '../utils/api';
import codeTimer from '../utils/codeTimer';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
const accounting = require('accounting');
const _ = require('lodash');
//const {FY} = require('../modules/FY');

class Back extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '还款'
    }

  };

  hideSpinner() {
    this.setState({ indicatorVisible: false });
  }

  showSpinner() {
    this.setState({ indicatorVisible: true });
  }

  constructor(props) {
    super(props);
    this.state = {
      showWebview: false,
      showFailed: false,
      failMessage: '',
      showBackFailed: false,
      order: {},
      bankName: null,
      bankLast: null,
      showLoading: true,
      mobile: null,
      code: null,
      requestno: null,
      isOver: false,
      overFee: 0,
      getCodeBtnText: '获取验证码',
      fyh5form: null,
      indicatorVisible: true,

      // 需要重新绑卡
      needRebind: false,
      bindTitle: '',
      warningTitle: '',
      cardNumber: '',
      rebindOK: false,
    };

    // this.fySubscription = FYEmiter.addListener('fyDone', async (fyResp) => {
    //   console.log('fyResp=>', fyResp);
    //
    //   if(fyResp['is_ios'] === true){
    //     return this.runFYiOSCB(fyResp);
    //   }
    //
    //   if(fyResp['resp_code'] === '0001'){
    //     return Toast('已取消还款');
    //   }
    //
    //   try{
    //     const code = fyResp['resp_desc'].split('<RESPONSECODE>')[1].split('</RESPONSECODE>')[0];
    //     if(code === '100017'){
    //       return this.setState({showFailed: true});
    //     }
    //
    //     if(code === '0000'){
    //       //await this.setState({showLoading: true});
    //       await api.get(`/borrow/order/set_backing/${this.state.order.id}`);
    //       Toast('还款处理中，请稍后刷新首页...');
    //       //await this.setState({showLoading: false});
    //       return this.goBackSuccess();
    //     }
    //
    //   }catch (e) {
    //
    //   }
    //
    //   Toast('还款处理中，请稍后刷新首页...');
    //
    //
    //
    // });
  }

  async runFYiOSCB(fyResp) {
    if (fyResp['resp_code'] === false && fyResp['resp_desc']['RESPONSECODE'] === '-2') {
      return Toast('已取消还款');
    }

    if (fyResp['resp_code'] === false && fyResp['resp_desc']['RESPONSECODE'] === '100017') {
      return this.setState({ showFailed: true });
    }

    if (fyResp['resp_code'] === true && fyResp['resp_desc']['RESPONSECODE'] === '0000') {
      //await this.setState({showLoading: true});
      const resp = await api.get(`/borrow/order/set_backing/${this.state.order.id}`);
      console.log('resp======>', resp);
      Toast('还款处理中，请稍后刷新首页...');
      //await this.setState({showLoading: false});
      return this.goBackSuccess();
    }


  }

  // async checkOver(order){
  //   if(!(order && order.ok_at)) return;
  //   const endDate = moment(moment(order.ok_at).add(order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00'));
  //   const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
  //   console.log('===================', order.day_length);
  //   if(endDate.unix() < nowDate.unix()){
  //     await this.setState({isOver: true});
  //   }
  // }

  runWebview(bF) {
    console.log(bF);
    const fyh5form = this.getFYH5Form(bF.forForm, bF.formUrl);
    console.log(fyh5form);
    this.setState({ fyh5form, showWebview: true })
  }

  async onNavigationStateChange(navState) {

    if (navState) {
      if (_.startsWith(navState.url, 'fy://success')) {
        this.goBackSuccess();
        await api.get(`/borrow/order/set_backing/${this.state.order.id}`);
        return Toast('还款处理中，请稍后刷新首页...');
      }

      if (_.startsWith(navState.url, 'fy://failed')) {
        return this.setState({ showWebview: false, showFailed: true });
      }
    }
  }

  /*
async componentWillReceiveProps(nextProps) {
  if(nextProps.navigation.state.params['order']) {
    console.log('FIN params in order', nextProps)
    await this.setState({
      order: nextProps.navigation.state.params['order'],
      bankName: nextProps.navigation.state.params['order']['bank_name'],
      bankLast: _.takeRight(nextProps.navigation.state.params['order']['card'], 4).join(''),
      // showLoading: true,
      // showLoading: false
    });

    // await this.checkOver(this.state.order);
    //
    // const resp = await api.get('/users/auth/bank/mobile');
    //
    // if(this.state.isOver === true){
    //   const endDate = moment(moment(this.state.order.ok_at).add(this.state.order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00')).unix();
    //   const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    //   const overDays = (nowDate - endDate) / 86400;
    //   const dayMoney = this.state.order.money * resp['over_fee']['day_rate'];
    //   const maxMoney = this.state.order.money * resp['over_fee']['max_rate'];
    //   let overFee = overDays * dayMoney;
    //   if(maxMoney < overFee){
    //     overFee = maxMoney;
    //   }
    //   this.setState({overFee});
    //
    // }
    //
    // this.setState({showLoading: false, });
    // if(resp['success']){
    //   return this.setState({mobile: resp['mobile']});
    // }
    // Toast('无法获取绑定银行卡对应的手机号');
  }
}
*/

  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });

    this.setPayData()
  }

  // 初始化付款数据
  setPayData = async () => {
    this.setState({
      order: this.props.navigation.state.params['order'],
      bankName: this.props.navigation.state.params['order']['bank_name'],
      bankLast: _.takeRight(this.props.navigation.state.params['order']['card'], 4).join(''),
    })


    const resp = await api.get(`/borrow/order/back_info/${this.props.navigation.state.params['order']['id']}`);
    if (resp['success'] === true) {
      const bF = resp['back_info'];
      //FY.run(bF.MCHNTORDERID, bF.MCHNTCD, `${bF.AMT}`, `${bF.USERID}`, bF.BANKCARD, bF.IDNO, bF.NAME, bF.BACKURL, bF.SIGN);
      // 弃用富有 H5 还款
      // this.runWebview(bF);
      this.setState({
        showLoading: false,
        showMoney: resp['back_money'],
        mobile: bF['mobile'],
        cardNumber: this.props.navigation.state.params['order']['card'],
      });
    }

    /*
  const resp = await api.get('/users/auth/bank/mobile');
  if(resp['success']){
    return this.setState({mobile: resp['mobile']});
  }
  */

  }




  // componentWillUnmount() {
  //   this.fySubscription.remove();
  // }

  getFYH5Form(data, url, method = 'POST') {
    // const list = [...data];
    // const formHtml = list.map(([key, val]) => {
    //   return `<input type='hidden' value='${val}' name='${key}' />`;
    // }).join('');
    const list = [];
    console.log('FIN FY h5 payPage url', url)
    console.log('FIN FY h5 payPage', data)

    for (let d of Object.keys(data)) {
      list.push(`<input type='hidden' value='${data[d]}' name='${d}' />`);
      //return ;
    }

    const formHtml = list.join('');

    return `
        <html>
        <head>
            <meta charset='utf-8' />
        </head>
        <body>
        <form id='fuiouform' style='display:none;' action='${url}' method='${method}'>
            ${formHtml}
        </form>
        <script>
            (function(){
                document.getElementById('fuiouform')
                    .submit();
            }());
        </script>
        </body>
        </html>
        `;
  }


  // ActivityIndicatorLoadingView() {
  //   return (
  //     <View style={styles.indicatorOutter}>
  //       <ActivityIndicator
  //         color={tm.mainColor}
  //         size='large'
  //
  //       />
  //     </View>
  //
  //   );
  // }

  render() {
    /*
    if(this.state.showWebview){
      return (
        <View  style={{ flex: 1}}>
          <WebView
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ html: this.state.fyh5form, baseUrl: '' }}
            onNavigationStateChange={(navState) => {this.onNavigationStateChange(navState)}}
            onLoadStart={() => (this.showSpinner())}
            onLoad={() => this.hideSpinner()}
            renderError={() => {return <View style={{ flex: 1, backgroundColor: '#dddddd'}}/>}}
          />
          {this.state.indicatorVisible && (
            <ActivityIndicator
              style={{
                flex: 1,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center' }}
              size="large"
            />
          )}
        </View>
      );
    }
    */

    // if(this.state.showMoney){
    //   return (<ScrollView keyboardShouldPersistTaps='handled' style={styles.container} contentContainerStyle={styles.containerC}>
    //     <StatusBar barStyle="dark-content"/>
    //     <Text>正在加载中</Text>
    //   </ScrollView>);
    // }

    if (this.state.showFailed) {
      return (<ScrollView keyboardShouldPersistTaps='handled' style={styles.container} contentContainerStyle={styles.containerC}>
        <StatusBar barStyle="dark-content" />
        <BackFailed show={true} doHide={() => { this.props.navigation.pop(); }} title={this.state.failMessage} />
      </ScrollView>);
    }

    return (
      <ScrollView keyboardShouldPersistTaps='handled' style={styles.container} contentContainerStyle={styles.containerC}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <View style={styles.hi}>
            <Text style={styles.hit}>总还款金额</Text>
            <Text style={styles.hic}>{accounting.formatNumber((this.state.showMoney) / 100, 2, ',')}元</Text>
          </View>

          <View style={styles.hi}>
            <Text style={styles.hit}>还款账户</Text>
            <Text style={styles.hic}>{this.state.bankName}（{this.state.bankLast}）</Text>
          </View>
        </View>

        <React.Fragment>
          {this.state.needRebind && <Text style={styles.rebindTitle}>{this.state.warningTitle}</Text>}
          {this.state.rebindOK && <Text style={styles.rebindTitle}>{this.state.warningTitle}</Text>}
          <View style={styles.mobileArea}>
            <View style={styles.mobileItem}>
              <Text style={styles.mobileTitle}>绑定手机</Text>
              <Text style={styles.mobile}>{this.state.mobile ? this.state.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''}</Text>
            </View>

            <View style={styles.mobileItem}>
              <Text style={styles.mobileTitle}>验 证 码</Text>
              <TextInput style={styles.input}
                autoCapitalize="none"
                onChangeText={(code) => this.setState({ code })}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                returnKeyType='next'
                placeholder='请输入验证码'
                returnKeyLabel='下一步'
                keyboardType='number-pad'
                ref={ip => this.textInput = ip}
                maxLength={6}
                selectionColor={tm.mainColor}
                placeholderTextColor='#969696' />
              <TouchableOpacity style={styles.getCodeBtn} onPress={() => { this.getCode() }}>
                <Text style={styles.getCodeBtnText}>{this.state.getCodeBtnText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </React.Fragment>

        <RedBtn style={styles.sureBtn} title='确定' show={true} onPress={() => {
          if (this.state.needRebind) {
            this.rebindCardConfirm()
          } else {
            this.showDoBackConfirm()
          }
        }} />

        <BackFailed show={this.state.showFailed === true} doHide={() => { this.setState({ showFailed: false }) }} />
        <BackFailed title={'提示'} content={'您已线下还款，如需继续还款请联系客服。'} show={this.state.showBackFailed === true} doHide={() => { this.setState({ showBackFailed: false }) }} />
        <Loading show={this.state.showLoading} text='加载中...' />
      </ScrollView>
    );
  }

  showDoBackConfirm() {
    Alert.alert(
      '二次提示',
      '是否确认还款',
      [
        { text: '取消' },
        {
          text: '确认', onPress: () => {
            this.goDoBack();
          }
        },
      ],
      { cancelable: false },
    );
  }

  async goDoBack() {
    const respOff = await api.get(`/borrow/is_offline/${this.state.order.id}`);
    if (respOff['code'] === 35001) {
      return this.setState({ showBackFailed: true });
    }

    if (this.textInput) this.textInput.blur();
    this.setState({ showLoading: true });
    const code = this.state.code

    // saul
    if (this.state.tokenData) {
      const resp = await api.post(`/borrow/order/${this.state.order.out_id}/back`, {
        trx_id: this.state.trx_id,
        code,
        token: this.state.tokenData.token,
        amount: this.state.tokenData.amount,
      });
      this.setState({ showLoading: false });
      if (resp['success'] === true) {
        Toast('还款处理中，请稍后刷新首页...');
        this.goBackSuccess();
      }
    } else {
      Toast('没有 tokenData')
    }
  }

  async getCode() {
    // 重复获取绑卡验证码
    if (this.state.needRebind) {
      return this.getCodeForRebind()
    }

    const respOff = await api.get(`/borrow/is_offline/${this.state.order.id}`);
    if (respOff['code'] === 35001) {
      return this.setState({ showBackFailed: true });
    }


    if (this.state.getCodeBtnText !== '获取验证码') return Toast(this.state.getCodeBtnText);
    //
    this.setState({ showLoading: true });

    let url = `/borrow/order/${this.state.order.out_id}/back`;
    // 第二次获取
    if (this.state.trx_id) {
      url = `${url}?trx_id=${this.state.trx_id}`;
    }

    const resp = await api.get(url);
    this.setState({
      showLoading: false,
    });


    if (resp['success'] === false && resp['type'] === 'auth') {
      const failMessage = resp['msg'] && resp['msg'][0] && resp['msg'][0].msg || ''
      // Toast(failMessage)

      // 调用获取绑定银行卡的验证码
      this.setState({
        needRebind: true,
        rebindOK: false,
        bindTitle: failMessage,
        warningTitle: '*您的绑卡信息已过期，请输入验证码绑卡',
      })
      return this.getCodeForRebind()
    }


    this.setState({
      showLoading: false,
      needRebind: false,
    });


    if (resp['success'] === true) {
      // 第一次储存
      if (!this.state.trx_id) {
        this.setState({ trx_id: resp['trx_id'] });
        this.setState({
          tokenData: resp['data'],
        })
      }
      Toast('获取验证码成功');
      codeTimer((s) => {
        this.setState({ getCodeBtnText: `${s}s重新获取` });
      }, () => {
        this.setState({ getCodeBtnText: '获取验证码' });
      }, 60);
    }

  }

  goBackSuccess() {
    this.props.navigation.push('BackSuccess');
  }

  // 获取绑定银行卡的验证码
  getCodeForRebind = async () => {
    const params = { mobile: this.state.mobile, cardNumber: this.state.cardNumber };
    // 第二次获取
    if (this.state.trx_id_forBindCard) {
      // params['trx_id'] = this.state.trx_id;
      params['trx_id'] = this.state.trx_id_forBindCard
    }

    const resp = await api.post('/users/auth/bank/code', params);
    this.setState({ showLoading: false });
    if (resp['success'] === true) {
      Toast('验证码获取成功')
      this.setState({
        // trx_id: resp['trx_id'],
        trx_id_forBindCard: resp['trx_id'],
      });

      this.setState({
        tokenData_forBindCard: resp['data'],
      })

      this.clear = codeTimer((s) => {
        //this.ipCode.focus();
        this.setState({ getCodeBtnText: `${s}s重新获取` });
      }, () => {
        this.setState({ getCodeBtnText: '获取验证码' });
      }, 60);
    }

  }

  rebindCardConfirm = async () => {
    this.setState({ showLoading: true });

    if (!this.state.tokenData_forBindCard) {
      return Toast('没有 tokenData')
    }

    const resp = await api.post('/users/auth/bank/bind',
      {
        code: this.state.code,
        mobile: this.state.mobile,
        cardNumber: this.state.cardNumber,

        trx_id: this.state.trx_id_forBindCard,
        token: this.state.tokenData_forBindCard.token,
      }
    )
    this.setState({ showLoading: false });
    if (resp['success'] === true) {
      Toast('绑定银行卡成功');
      this.setState({
        needRebind: false,
        rebindOK: true,
        warningTitle: '绑卡成功，请再次获取验证码操作还款',
      })

      // 重置验证码输入
      this.setState({
        getCodeBtnText: '获取验证码',
      })
      this.clear && this.clear()
      this.textInput && this.textInput.clear()
    } else {
      Toast('绑定银行卡失败');
    }


  }
}


const styles = StyleSheet.create({
  indicatorOutter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  mobile: {
    position: 'absolute',
    right: p.td(30),
    top: 0,
    color: '#4F5A6E',
    fontSize: p.td(28),
    lineHeight: p.td(92),
    textAlign: 'right',
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
    height: p.td(93),
    width: p.td(750),
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(1),
    position: 'relative'
  },
  mobileArea: {
    // height: p.td(187),
    borderTopColor: '#ddd',
    borderTopWidth: p.td(1),
    width: p.td(750),
    backgroundColor: '#fff',
    marginTop: p.td(18)
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
  hic: {
    lineHeight: p.td(40),
    color: '#4F5A6E',
    fontSize: p.td(28),
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  hit: {
    lineHeight: p.td(40),
    color: '#737577',
    fontSize: p.td(28),
    textAlign: 'left',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  hi: {
    height: p.td(40),
    width: p.td(682),
    position: 'relative',
    marginBottom: p.td(30)
  },
  header: {
    width: p.td(750),
    height: p.td(197),
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(1),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: p.td(44)
  },
  sureBtn: {
    position: 'absolute',
    // bottom: p.td(30),
    top: p.td(550),
    left: p.td(225),
    width: p.td(300),
    zIndex: 2,
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rebindTitle: {
    marginTop: p.td(50),
    marginLeft: p.td(30),
    marginBottom: p.td(3),
    lineHeight: p.td(50),
    color: '#e73939',
    fontSize: p.td(28),
    textAlign: 'left',
    alignSelf: 'stretch',
    opacity: 0.8,
  }

});
export default createStackNavigator({
  Back: {
    screen: Back
  }
}, {
  initialRouteName: 'Back',
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
