import React from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  AsyncStorage, StatusBar,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import HeaderBackBtn from '../../cpns/small/HeaderBackBtn'
import { p } from "../../utils/p";
import api from '../../utils/api'
import Toast from '../../utils/toast'
import { tm } from '../../utils/theme'
import { removeArr } from '../../utils/removeArr'
import { createStackNavigator } from "react-navigation";
import RedBtn from "../../cpns/small/RedBtn";
import Contacts from 'react-native-contacts';
const _ = require('lodash');
const uuidv1 = require('uuid/v1');
import Permissions from 'react-native-permissions';

import { UD, UDEmitter } from '../../modules/UD';
import { Moxie, MoxieEmiter } from '../../modules/Moxie';
import Loading from "../../cpns/small/Loading";
import { Sms } from "../../modules/Sms";

import AndroidOpenSettings from 'react-native-android-open-settings';
import PubSub from "pubsub-js";
import { AuthenticationCenterStyles } from "./AuthenticationCenterStyles";
import { AreaPicker } from "react-native-pickers";
import AreaJson from './Area.json';

import { getAppKey } from "../../utils/getAppKey";

const { icons } = tm;

const authIcons = {
  sm: {
    on: require('../images/icons/auth/sm.png'),
    off: require('../images/icons/auth/sm-1.png')
  },
  yy: {
    on: require('../images/icons/auth/yy.png'),
    off: require('../images/icons/auth/yy-1.png')
  }
  ,
  ali: {
    on: require('../images/icons/auth/ali.png'),
    off: require('../images/icons/auth/ali-1.png')
  },
  yh: {
    on: require('../images/icons/auth/yh.png'),
    off: require('../images/icons/auth/yh-1.png')
  }
};

const contactIcon = {
  red: require('../images/icons/red/contact.png'),
  blue: require('../images/icons/blue/contact.png'),
  green: require('../images/icons/green/contact.png')
};

const cnP = ['一', '二'];

const checkContactPermission = () => {
  console.log('FIN contacts', Contacts)
  if (!Contacts.checkPermissions) return false;
  return new Promise(resolve => {

    Contacts.checkPermissions((err, permission) => {
      console.log('FIN Contacts.checkPermissions', err, 'permission =>', permission);
      if (err) return resolve(false);
      if (permission !== 'authorized') {
        return resolve(false);
      }

      resolve(true);
    })
  });
};


const showIOSContactAlert = () => {
  Alert.alert(
    '提示',
    '请在iPhone的"设置-隐私-通讯录"选项中允许当前应用访问您的通讯录',
    [
      { text: '确定', onPress: async () => { Linking.openURL('app-settings:') } },
    ]
  )
};

const showAndroidContactAlert = () => {
  Alert.alert(
    '提示',
    '请允许当前应用访问您的通讯录',
    [
      {
        text: '确定',
        onPress: async () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            AndroidOpenSettings.appDetailsSettings();
          }

        }
      },
    ]
  )
};

const showAndroidSmsAlert = () => {
  Alert.alert(
    '提示',
    '设置紧急联系人请允许平台访问您的短信',
    [
      { text: '确定', onPress: async () => { AndroidOpenSettings.appDetailsSettings() } },
    ]
  )
};

const requestContactPermission = () => {
  return new Promise(resolve => {
    Contacts.requestPermission((err, permission) => {
      console.log('FIN Contacts.requestPermission =>', err, 'permission =>', permission);
      if (permission === 'denied') {
        if (Platform.OS === 'ios') {
          showIOSContactAlert();
        } else {
          showAndroidContactAlert();
        }
      }

      if (err) return resolve(false);
      if (permission !== 'authorized') {
        return resolve(false);
      }
      resolve(true);
    })
  });
};


class Right extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.ok === true) {
      return (
        <View style={styles.finished}>
          <Image style={styles.fi} source={require('../images/icons/finished.png')} />
          <Text style={styles.ft}>完善</Text>
        </View>
      );
    }
    if (this.props.isContact === true) return (<Image style={[styles.wi, styles.wic]} source={icons.contact} />);
    return (<Image style={styles.wi} source={require('../images/icons/arrow-dblue.png')} />);
  }
}

class AuthIcon extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { icon, ok } = this.props;
    if (ok === true) return (<Image fromWeb={false} style={[styles.ai, styles[icon]]} source={authIcons[icon]['on']} />);
    return <Image fromWeb={false} style={[styles.ai, styles[icon]]} source={authIcons[icon]['off']} />
  }
}

class AuthArrow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { ok } = this.props;
    if (ok === true) return (<Image style={[styles.ar, this.props.style]} source={require('../images/icons/arrow-dblue.png')} />);
    return (<Image style={[styles.ar, this.props.style]} source={require('../images/icons/arrow-g.png')} />);
  }
}

class EP extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { ok } = this.props;
    if (ok === true) return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.delCT} onPress={() => { this.props.onDel() }}>
          <Image style={styles.delC} source={require('../images/icons/del-contact.png')} />
        </TouchableOpacity>
        <Text style={styles.emP}>{this.props.name}</Text>
        <Text style={styles.emPC}>{this.props.contact}</Text>
      </View>
    );
    return null;
  }
}

class AuthenticationCenter extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '认证中心'
    }

  };

  async setStepArr(id, status = true) {
    const stepArr = this.state.stepArr;
    stepArr[id] = status;
    await this.setState({ stepArr });
    this.checkAllTrue();
  }

  checkAllTrue() {
    const aa = _.uniq(this.state.stepArr);
    this.setState({ allTrue: (aa.length === 1 && aa[0] === true) })
  }

  // 从操作页返回时带回状态结果数据
  async componentWillReceiveProps(nextProps) {
    console.log('FIN componentWillReceiveProps in AuthPage', nextProps)
    if (!nextProps.navigation.state.params['r']) return;
    switch (nextProps.navigation.state.params.r.statusName) {
      case 'bankCard':
        await this.setState({ disableBank: false });
        if (nextProps.navigation.state.params.r['status'] !== true) break;
        const stepArr = this.state.stepArr;
        stepArr[3] = true;
        await this.setState({ stepArr });
        break;
      case 'backContact':
        console.log('FIN backContact', nextProps.navigation.state.params);
        await this.setState({ disableContacts: false });
        if (nextProps.navigation.state.params.r['status'] !== true) {
          await this.setStepArr(4, false);
          await this.setState({ selectedItem: [], selectRecordId: {} });
        }
        await this.setState({
          selectedItem: nextProps.navigation.state.params.r.selectedItem,
          selectRecordId: nextProps.navigation.state.params.r.selectRecordId
        });

        const stepArrContact = this.state.stepArr;
        if (this.state.selectedItem && this.state.selectedItem.length === 2) stepArrContact[4] = true;

        await this.setState({ stepArr: stepArrContact });
        this.checkAllTrue();
        break;
    }

    this.checkAllTrue();

  }

  constructor(props) {
    super(props);
    this.state = {
      allTrue: false,
      stepArr: [false, false, false, false, false],
      selectedItem: [],
      contacts: [],
      showLoading: false,
      udOrderId: null,
      idName: null,
      idNumber: null,
      mobile: null,
      disableUD: false,
      disableMoXieCarrier: false,
      disableMoXieAliPay: false,
      disableBank: false,
      disableContacts: false,
      smsNeedUpload: true,
      addressFront: '点击选择'
    };

    this.moxieSubscription = MoxieEmiter.addListener('moxieDone', async (moxie) => {
      this.setState({ disableMoXieCarrier: false, disableMoXieAliPay: false });
      console.log('FIN Moxie done!')
      console.log('FIN Moxie data', moxie);

      if (moxie['functionName'] === 'carrier' && moxie['success'] === true) {
        await this.setState({ showLoading: true });
        const resp = await api.post('/users/auth/carrier', { orderId: moxie['taskId'], mobile: this.state.mobile });
        await this.setStepArr(1, resp['success']);
        Toast(resp['success'] === true ? '运营商认证成功' : '运营商认证未通过');
        this.setState({ showLoading: false });
      }

      if (moxie['functionName'] === 'alipay' && moxie['success'] === true) {
        await this.setState({ showLoading: true });
        const resp = await api.post('/users/auth/alipay', { orderId: moxie['taskId'] });
        await this.setStepArr(2, resp['success']);
        Toast(resp['success'] === true ? '支付宝认证成功' : '支付宝认证未通过');
        this.setState({ showLoading: false });
      }
    });

    this.udSubscription = UDEmitter.addListener('udDone', async (ud) => {
      console.log('FIN ud done!')
      await this.setState({ showLoading: true, disableUD: false });
      console.warn(ud, this.state.udOrderId);
      if (ud['result'] === '0' && this.state.udOrderId) {
        const resp = await api.post('/users/auth/id', { orderId: this.state.udOrderId });
        await this.setStepArr(0, resp['success']);
        if (resp['success'] !== true) {
          Toast('实名认证未通过');
        } else {
          this.setState({ idName: resp['name'], idNumber: resp['idNumber'] });
          Toast('实名认证成功');
        }
      }

      this.setState({ showLoading: false });
    });
  }

  async getAuthStatus() {
    await this.setState({ showLoading: true });
    const resp = await api.get('/users/auth/status');
    const respSms = await api.get('/sms/is_uploaded');
    this.setState({ smsNeedUpload: !respSms['success'] });

    console.log(resp);

    if (resp['success'] === true) {
      if (resp['ud_status'] === true && resp['ud']['result']['success'] === true && resp['ud']['data']['auth_result'] === 'T') {
        await this.setStepArr(0, true);
        this.setState({ idName: resp['ud']['data']['id_name'], idNumber: resp['ud']['data']['id_number'] });
      }

      if (resp['carrier_status'] === true) {
        await this.setStepArr(1, true);
      }

      if (resp['alipay_status'] === true) {
        await this.setStepArr(2, true);
      }

      if (resp['bank_status'] === true) {
        await this.setStepArr(3, true);
      }

    }

    this.setState({ showLoading: false });
  }

  async componentDidMount() {
    // console.log('FIN componentDidMount in AuthPage', this.props)
    let mxApiKey;
    await this.setState({ showLoading: true });
    try {
      const resp = await api.get('/users/auth/moxie/api_key');
      mxApiKey = resp['api_key'];
      this.setState({ showLoading: false });
    } catch (e) {
      mxApiKey = '29c393265f804f868a0b3b60a09472a3';
      this.setState({ showLoading: false });
    }
    if (!mxApiKey || mxApiKey === '' || mxApiKey === undefined || mxApiKey === null) {
      mxApiKey = '29c393265f804f868a0b3b60a09472a3';
    }

    this.props.navigation.setParams({ back: this.props.navigation.pop });
    const sid = await AsyncStorage.getItem('sid');
    const uid = await AsyncStorage.getItem('uid');
    const mobile = await AsyncStorage.getItem('mobile');
    this.setState({ mobile });
    Moxie.init(`${sid.replace(/-/g, '')}-${uid}-${getAppKey()}`, mxApiKey);
    this.getAuthStatus();

  }

  componentWillUnmount() {
    console.log('FIN subscribtion removed')
    this.moxieSubscription.remove();
    this.udSubscription.remove();
  }

  async goUD() {
    this.setState({ disableUD: true });
    if (this.state.stepArr[0] === true) return this.setState({ disableUD: false });

    await this.setState({ showLoading: true, udOrderId: uuidv1().replace(/-/g, '') });//showLoading: true,
    const resp = await api.get('/users/auth/pay/check');
    await this.setState({ showLoading: false });
    setTimeout(() => {
      if (resp['success'] === true) {
        UD.run(this.state.udOrderId, '5207f431-e7da-4f62-9cef-86785d528991');
      }
    }, 300);
  }

  // 原来的
  async goMoXieCarrier() {

    this.setState({ disableMoXieCarrier: true });
    if (this.state.stepArr[0] === true) {
      if (this.state.stepArr[1] !== true) {
        if (!(this.state.contacts && this.state.contacts.length > 0)) {
          if (await checkContactPermission() !== true) {
            if (await requestContactPermission() !== true) {
              console.log('FIN 用户未允许')
              return this.setState({ disableMoXieCarrier: false });
            }
          }

          Contacts.getAllWithoutPhotos(async (err, contacts) => {
            if (contacts.length <= 0) {
              console.log('FIN contacts length', contacts)
              // 该用户手机联系人为空，排除该用户
              this.setState({ disableMoXieCarrier: false });
              return Toast('您的通讯录联系人为空，无法上传')
            }

            await this.setState({ showLoading: true });
            await api.post('/users/contacts/upload', { contacts });

            this.setState({ contacts });

            const resp = await api.get('/users/auth/pay/check');
            await this.setState({ showLoading: false });
            if (resp['success'] === true) {
              return Moxie.carrier(this.state.idName, this.state.idNumber, this.state.mobile);
            }
          });

        } else {
          await this.setState({ showLoading: true });
          const resp = await api.get('/users/auth/pay/check');
          await this.setState({ showLoading: false });
          if (resp['success'] === true) {
            return Moxie.carrier(this.state.idName, this.state.idNumber, this.state.mobile);
          }
        }

      }
      return this.setState({ disableMoXieCarrier: false });
    }
    Toast('请先完成实名认证');
    this.setState({ disableMoXieCarrier: false });
  }

  async goMoXieAliPay() {
    this.setState({ disableMoXieAliPay: true });
    if (this.state.stepArr[0] === true) {
      if (this.state.stepArr[1] !== true) {
        this.setState({ disableMoXieAliPay: false });
        return Toast('请先完成运营商认证');
      }
      if (this.state.stepArr[2] !== true) {
        await this.setState({ showLoading: true });
        const resp = await api.get('/users/auth/pay/check');
        await this.setState({ showLoading: false });
        if (resp['success'] === true) {
          return Moxie.run('alipay', this.state.idName, this.state.idNumber, this.state.mobile);
        }
      }
      return this.setState({ disableMoXieAliPay: false });
    }
    Toast('请先完成实名认证');
    this.setState({ disableMoXieAliPay: false });
  }

  async goAddBank() {
    if (this.state.stepArr[3] === true) return;
    this.setState({ disableBank: true });
    if (this.state.stepArr[0] === true) {
      if (this.state.stepArr[2] !== true) {
        this.setState({ disableBank: false });
        return Toast('请先完成支付宝认证');
      }
      await this.setState({ showLoading: true });
      const resp = await api.get('/users/auth/pay/check');
      await this.setState({ showLoading: false });
      if (resp['success'] === true) {
        return this.props.navigation.push('AddBankCard');
      }
    }
    Toast('请先完成实名认证');
    this.setState({ disableBank: false });
  }

  render() {
    const eps = [];

    for (let i = 0; i < this.state.selectedItem.length; i++) {
      // console.log('this.state.selectedItem[i][\'familyName\']', this.state.selectedItem[i]['familyName']);
      // console.log('this.state.selectedItem[i][\'middleName\']', this.state.selectedItem[i]['middleName']);
      // console.log('this.state.selectedItem[i][\'givenName\']', this.state.selectedItem[i]['givenName']);
      const fn = this.state.selectedItem[i]['familyName'] ? this.state.selectedItem[i]['familyName'] : '';
      const mn = this.state.selectedItem[i]['middleName'] ? this.state.selectedItem[i]['middleName'] : '';
      const gn = this.state.selectedItem[i]['givenName'] ? this.state.selectedItem[i]['givenName'] : '';

      try {
        const phone = this.state.selectedItem[i]['phoneNumbers'][0]['number'].replace(/-/g, '');
        eps.push(
          <EP
            ok={true} key={i}
            onDel={async () => { await this.delContact(this.state.selectedItem[i]) }} name={`紧急联系人${cnP[i]}`}
            contact={`${fn}${mn}${gn} ${phone}`} />
        );
      } catch (e) {
        console.log('FIN getEMSContacts err', e)
        this.setState({ selectedItem: [] });
        Toast('请选择有效的紧急联系人');
      }
    }

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.containerC}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <AuthIcon icon='sm' ok={this.state.stepArr[0]} />
          <AuthIcon icon='yy' ok={this.state.stepArr[1]} />
          <AuthIcon icon='ali' ok={this.state.stepArr[2]} />
          <AuthIcon icon='yh' ok={this.state.stepArr[3]} />


          <AuthArrow style={styles.ar1} ok={this.state.stepArr[0]} />
          <AuthArrow style={styles.ar2} ok={this.state.stepArr[1]} />
          <AuthArrow style={styles.ar3} ok={this.state.stepArr[2]} />

        </View>

        <TouchableOpacity disabled={this.state.disableUD} onPress={() => { this.goUD() }}>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>实名认证</Text>
            <Right ok={this.state.stepArr[0]} />
          </View>
        </TouchableOpacity>


        <TouchableOpacity disabled={this.state.disableMoXieCarrier} onPress={() => { this.goMoXieCarrier() }}>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>运营商认证</Text>
            <Right ok={this.state.stepArr[1]} />
          </View>
        </TouchableOpacity>


        <TouchableOpacity disabled={this.state.disableMoXieAliPay} onPress={() => { this.goMoXieAliPay() }}>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>支付宝认证</Text>
            <Right ok={this.state.stepArr[2]} />

          </View>
        </TouchableOpacity>


        <TouchableOpacity disabled={this.state.disableBank} onPress={() => { this.goAddBank() }}>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>银行卡认证</Text>
            <Right ok={this.state.stepArr[3]} />
          </View>
        </TouchableOpacity>

        {/*<Text style={styles.subTitle}>请填写居住地址</Text>*/}

        {/*<TouchableOpacity onPress={() => {this.AreaPicker.show()}}>*/}
        {/*<View style={styles.item}>*/}
        {/*<Text style={styles.itemTitleAddress}>选择地区：</Text>*/}
        {/*<Text style={[styles.itemAddressRight, this.state.addressFront === '点击选择' ? {} : styles.itemAddressRightOn]}>{this.state.addressFront}</Text>*/}
        {/*</View>*/}
        {/*</TouchableOpacity>*/}
        {/*<TextInput style={styles.item}*/}
        {/*autoCapitalize="none"*/}
        {/*onChangeText={(addressEnd) => this.setState({addressEnd})}*/}
        {/*value={this.state.addressEnd}*/}
        {/*autoCorrect={false}*/}
        {/*underlineColorAndroid='transparent'*/}
        {/*placeholder='详细地址：(如：诚实北大街幸福北里15幢3单元2502)'*/}
        {/*selectionColor={tm.mainColor}*/}
        {/*placeholderTextColor='#BDC3C7'/>*/}

        <Text style={styles.subTitle}>设置紧急联系人(2位)</Text>

        <TouchableOpacity disabled={this.state.disableContacts} onPress={() => { this.setState({ disableContacts: true }); this.getContacts() }}>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>紧急联系人</Text>
            <Right ok={this.state.stepArr[4]} isContact={true} />
          </View>
        </TouchableOpacity>

        {eps}

        <RedBtn style={styles.goNextSure} title='确定' disabled={this.state.allTrue !== true} show={true} onPress={() => { this.goNext() }} />


        <AreaPicker
          areaJson={AreaJson}
          onPickerCancel={() => { }}
          itemSelectedColor={tm.mainColorHex}
          onPickerConfirm={(value) => {
            this.setState({ addressFront: `${value[0]}-${value[1]}-${value[2]}` })
          }}
          ref={ref => this.AreaPicker = ref} />

        <Loading show={this.state.showLoading} />
      </ScrollView>
    );
  }

  async fuckinSms() {
    await this.setState({ showLoading: true });
    const smsResult = await Sms.getAll();

    await this.setState({ showLoading: false });
    if (smsResult['sms'] === "no result!" || smsResult['sms'] === "[]") {
      // this.setState({disableContacts: false});
      // showAndroidSmsAlert();
      // Toast('您的短信为空')
      return true;
    }
    await this.setState({ showLoading: true });
    await api.post('/sms', smsResult);
    await this.setState({ showLoading: false, smsNeedUpload: false });
    return true;
  }

  async getContacts() {

    if (this.state.stepArr[0] === true) {
      if (this.state.stepArr[3] !== true) {
        this.setState({ disableContacts: false });
        return Toast('请先完成银行卡认证');
      }

      // 安卓获取紧急联系人
      if (Platform.OS !== 'ios' && this.state.smsNeedUpload) {

        const checkReadSms = await Permissions.check('readSms');
        console.log('FIN 获取短信的权限', checkReadSms)
        if (checkReadSms !== 'authorized') {
          const requestReadSms = await Permissions.request('readSms');

          if (requestReadSms !== 'authorized') {
            this.setState({ disableContacts: false });
            return showAndroidSmsAlert();
          } else {
            const r = await this.fuckinSms();
            if (r === false) return;
          }

        } else {
          const r = await this.fuckinSms();
          if (r === false) return;
        }
      }

      const stepArr = this.state.stepArr;
      console.log('FIN auth state', this.state)

      if (this.state.contacts && this.state.contacts.length > 0) {
        this.props.navigation.push('Contacts', {
          contacts: this.state.contacts,
          selectedItem: this.state.selectedItem,
          selectRecordId: this.state.selectRecordId
        });
      } else {
        if (await checkContactPermission() !== true) {
          if (await requestContactPermission() !== true) {
            return this.setState({ disableContacts: false });
          }
        }
        await this.setState({ showLoading: true });
        Contacts.getAllWithoutPhotos(async (err, contacts) => {
          await this.setState({ showLoading: false });
          if (contacts.length <= 0) {
            this.setState({ disableContacts: false });
            return Toast('您的通讯录联系人为空，无法上传')
            /*
            this.setState({disableContacts: false});
            if(Platform.OS === 'ios'){
              return showIOSContactAlert();
            }else{
              return showAndroidContactAlert();
            }
            */

          }
          await this.setState({ showLoading: true });
          await api.post('/users/contacts/upload', { contacts });
          await this.setState({ showLoading: false });
          this.setState({ contacts });
          this.props.navigation.push('Contacts', { contacts });
        });
      }

      await this.setState({ stepArr });

      return this.checkAllTrue();
    }
    Toast('请先完成实名认证');
    this.setState({ disableContacts: false });
  }

  async goNext() {
    // if(this.state.addressFront === '点击选择') return Toast('请选择地区');
    // if(_.trim(this.state.addressEnd).length < 3) return Toast('详细地址最少3个字');

    // selectedItem 中本身就有 recordID 数据
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

  async delContact(item) {
    const stepArr = this.state.stepArr;
    stepArr[4] = false;
    this.setState({ stepArr });
    this.state.selectedItem = removeArr(this.state.selectedItem, item);
    delete this.state.selectRecordId[item.recordID];
    await this.setState({ selectedItem: this.state.selectedItem, selectRecordId: this.state.selectRecordId });
    console.log(stepArr, this.state.selectedItem, this.state.selectRecordId);
    this.checkAllTrue();
  }
}

const getLengthByBuffer = function (str) {
  const buffer = Buffer.from(str);
  return buffer.length;
};


const styles = AuthenticationCenterStyles;
export default createStackNavigator({
  AuthenticationCenter: {
    screen: AuthenticationCenter
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
