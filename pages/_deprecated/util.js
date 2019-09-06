import { Dimensions, AsyncStorage, Platform } from 'react-native';
import Toast from "react-native-root-toast";
const BuildConfig = require('react-native-build-config');
import AnalyticsUtil from '../../umeng/AnalyticsUtil';

/*
 *
 * 已废弃
 * 待已拆分出来的模块经过测试没有任何 bug 之后将此文件删除

// 设备宽度，单位 dp
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('screen').height;

// 设计稿宽度（这里为640px），单位 px
const uiWidthPx = 750;

const themeName = 'red';

let host = BuildConfig.HOST;
console.log('BuildConfig', BuildConfig)
if(Platform.OS === 'ios'){
  // host = 'http://api.fts.whatpig.com/api' // fts系列
  host = 'http://api.ft.whatpig.com/api' // ft系列
}
//const host = 'http://192.168.8.100:3104/api';
//const host = 'http://192.168.8.115:3104/api';
//const host = 'http://api.fintech.zthing.cn/api';
  host = 'http://api.ft.whatpig.com/api' // ft系列

let navigation, reLoginHomeCB;


const toast = (msg) => {
  return Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: false,
    animation: true,
    hideOnPress: true
  });
};

const to = async (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};

doError = (params) => {
  console.log('doError navigation',navigation)
  // if(params){
  //   return navigation.navigate('NetworkError', {fuck: params});
  // }
  // navigation.navigate({routeName: 'NetworkError'});
};

export const getAppKey = () => {
  if(Platform.OS === 'android'){
    return BuildConfig.APP_KEY;
  }else{
    //return 'bec5c01b'; // fts系列 点我花
    return '2f9c52d2'; // ft系列 米大侠
  }
};

class Api{
  constructor(){
    this.showError = true;
    this.withHeader = true;
  }

  hideError(){
    this.showError = false;
    return this;
  }

  withoutHeader(){
    this.withHeader = false;
  }

  async setHeader () {
    if(this.withHeader === false) return {};
    let di = await AsyncStorage.getItem('deviceInfo');
    let appkey = getAppKey();
    this.headers = {
      'X-FINTECH-APPKEY': appkey, //'5cea1480',//ba064212   //9ec5c01b   //5cea1480
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-DEVICE-INFO': encodeURIComponent(di)
    };
    let sid = await AsyncStorage.getItem('sid');

    // console.log('==================>sid', sid)
    // 开发环境设置临时 sid
    // sid = '9b133039-49c2-4a5a-b1af-48bbfbc8b5af'
    if(sid){
      this.headers['X-FINTECH-SID'] = sid;
    }

  }

  reLoginCB(){
    try{
      reLoginHomeCB();
    }catch(err){

    }
  }

  // over
  errorHandler(){
    const json = this.json;
    if(this.showError === false) return;
    if(json['success'] === false){
      switch(json['code']){
        case 8002:
          navigation.navigate({routeName: 'Logup'});
          this.reLoginCB();
          break;
        case 8001:
          navigation.navigate({routeName: 'Logup'});
          this.reLoginCB();
          break;
      }
    }

    if(json['success'] === false && json['msg'] instanceof Array && json['msg'].length > 0){
      const ma = [];
      const mas = {};

      for(let m of json['msg']){
        if(!mas.hasOwnProperty(m['param'])){
          mas[m['param']] = m['msg'];
        }
      }

      for(let mm of Object.keys(mas)){
        ma.push(mas[mm]);
      }

      toast(ma.join('\n'));
    }
  }

  // over
  async buildSid(){
    if(this.json['success'] === true && this.json['sid']){
      AnalyticsUtil.profileSignInWithPUID(this.json['uid']);

      await AsyncStorage.setItem('sid', this.json['sid']);
      await AsyncStorage.setItem('uid', this.json['uid']);
    }
  }

  async post(url, body = {}){
    const fullUrl = `${host}${url}`;
    await this.setHeader();
    const info = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    };

    try{
      const resp = await fetch(fullUrl, info);
      console.log(fullUrl, info);

      this.json = await resp.json();
      this.errorHandler();
      await this.buildSid();
      await this.checkSid();
      return this.json;

    }catch(err){
      // over
      AnalyticsUtil.onEventObject("post_error",{
        fullUrl, info: JSON.stringify(info), err: err.message
      });
      // console.log('~~~~~~~~~~~', err.message, '~~~~~~', error.stack);
      doError({
        fullUrl, info, err:err.message
      });
      return {success: false};
    }
  }

  async get(url){
    const fullUrl = `${host}${url}`;
    await this.setHeader();
    const info = {
      method: 'GET',
      headers: this.headers
    };

    try{
      console.log(fullUrl, info);
      const resp = await fetch(fullUrl, info);

      this.json = await resp.json();
      this.errorHandler();
      await this.checkSid();
      return this.json;
    }catch(err){
      AnalyticsUtil.onEventObject("get_error", {
        fullUrl, info: JSON.stringify(info), err: err.message
      });
      // console.log('~~~~~~~~~~~', err.message);
      doError({
        fullUrl, info, err: err.message
      });
      return {success: false};
    }
  }


  // over
  async checkSid(){
    if(this.json['success'] !== true && (this.json['msg'] === '登录已过期' || this.json['msg'] === '没有appkey' || this.json['msg'] === '未找到appkey')){
      await AsyncStorage.clear();
      this.toast('请重新登录');
    }
  }


  // over
  showTrueToast(resp, msg){
    console.log('saul showTrueToast')
    if(resp['success'] === true) toast(msg);
  }

  delete(url){

  }

  _toast(msg){
    toast(msg);
  }

  // over
  async codeTimer(change, done, time){
    for(let i = 0; i < time; i++){
      change(time - i);
      await to(1000);
    }
    done();
  }
}

// px 转 dp（设计稿中的 px 转 rn 中的 dp）
export const p = {
  td: (uiElePx) => {
    //console.warn(uiElePx, deviceWidthDp, uiWidthPx, deviceHeightDp, uiElePx * deviceWidthDp / uiWidthPx);
    return uiElePx * deviceWidthDp / uiWidthPx;
  },
  h: deviceHeightDp,
  tn: themeName,
  setNavigation: (_navigation, _reLoginHomeCB) => {
    reLoginHomeCB = _reLoginHomeCB;
    navigation = _navigation;
  }
};

export const tm = theme[themeName];

export const api = new Api();

export const statusToName = (id) => {
  const mapping = {
    'id_0': 'normal', //正在审核
    'id_1': 'banking', //放款中
    'id_2': 'success', //待还款，未逾期
    'id_3': 'over', //待还款，已逾期
    'id_4': 'finished', //已完结
    'id_5': 'processing', //还款处理中
    'id_6': '',
    'id_11': 'refused', //拒绝
  };
  return mapping[`id_${id}`];
};
*/




