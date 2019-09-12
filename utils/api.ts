/*
 * Created by Saul at 2019/06/05
 *
 * api 封装
 *
 * 拦截以下下几种常见场景
 *
 * 网络错误
 * 储存会话凭证
 * 登录过期
 * app 更新
 *
 */

import { AsyncStorage, Platform } from 'react-native';
import axios from 'axios';

import AnalyticsUtil from '../umeng/AnalyticsUtil';
import NavigationService from './NavigationService'
import Toast from './toast'
import BuildConfig from './nativeConfig';
import bugsnag from './bugsnag'


/*
 * 创建一个 api
 *
 * @param baseURL String
 * @param appKey  String
 * @return axios
 */
const creatAPI = (baseURL, appKey) => {

  const apiConfigOptions = {
    baseURL,
    timeout: 50000,
    Accept: 'application/json',
    headers: {
      'Content-Type': 'application/json',
      'X-FINTECH-APPKEY': appKey,
    }
  }

  const api = axios.create(apiConfigOptions)

  // 获取设备信息
  const getDeviceId = async () => {
    try {
      const deviceInfo = await AsyncStorage.getItem('deviceInfo');
      console.log('device info', JSON.parse(deviceInfo))
      return deviceInfo
    } catch (err) {
      console.log('getDeviceIdError', err)
    }
  }


  // 请求发送拦截
  api.interceptors.request.use(
    async (config) => {
      // 设备信息
      config.headers['X-DEVICE-INFO'] = encodeURIComponent(await getDeviceId())
      // console.log(`URL: ${config.url}`, config)

      // session id
      const sid = await AsyncStorage.getItem('sid')
      if (sid) {
        config.headers['X-FINTECH-SID'] = sid
      }

      return config
    },
    error => Promise.reject(error)
  )

  // 请求结果拦截
  api.interceptors.response.use(
    async (resp) => {
      console.log(`URL:(${resp.config.method}) request for ${resp.config.url}`, resp)
      const data = resp.data

      // 1. 业务请求失败
      let fail = resp['status'] === 200 && data && data['success'] === false
      if (fail) {
        console.log('FIN fail request', resp)
        switch (data['code']) {
          case 8002:
            NavigationService.navigate('Logup')
            // TODO
            console.log('set home screen state showstatus to 0')
            break;
          case 8001:
            NavigationService.navigate('Logup')
            // TODO
            console.log('set home screen state showstatus to 0')
            break;
          case 666:     // 假设这个 code 是判断热更新
            navigateToAppUpdate(resp)
            break;
        }

        // 冷热更新
        if (fail && data && data['failed_code'] && data['failed_code'] === 'new_version_found') {
          const innerData = data['data']
          navigateToAppUpdate(innerData)
        }

        if (data['msg'] instanceof Array && data['msg'].length > 0) {
          const ma = []
          const mas = {}

          for (let m of data['msg']) {
            if (!mas.hasOwnProperty(m['param'])) {
              mas[m['param']] = m['msg']
            }
          }

          for (let mm of Object.keys(mas)) {
            ma.push(mas[mm]);
          }

          if (data['type'] !== 'auth') {
            Toast(ma.join('\n'))
          }
          return data
        }

        // 2. 会话错误
        if (data['msg'] && ['登录已过期', '没有appkey', '未找到appkey'].indexOf(data['msg']) > -1) {
          await AsyncStorage.clear()
          console.log('FIN error message:', data['msg'])
          Toast('请重新登录')
          return data
        }

        return data
      }


      // 3. 请求成功
      const success = resp['status'] === 200 && data && data['success'] === true

      // 4. 保存会话 id
      const hasIds = success && resp.config.method === 'post' && data['sid'] && data['uid']
      // set sid and uid
      if (hasIds) {
        const sid = resp.data.sid
        await AsyncStorage.setItem('sid', sid)

        const uid = resp.data.uid
        await AsyncStorage.setItem('uid', uid)

        AnalyticsUtil.profileSignInWithPUID(uid)
      }

      return data
    },
    error => {
      const { config, message } = error
      console.log('FIN error requset config', config)
      const { method, url, data } = config

      console.log('FIN error message:', message)

      AnalyticsUtil.onEventObject(`${method}_error`, {
        fullUrl: url,
        info: JSON.stringify(data),
        err: message
      })

      NavigationService.navigate('NetworkError')

      bugsnag.notify(error)
      return { success: false };
    }
  )

  return api
}

// 弹出更新页面
function navigateToAppUpdate(data) {
  let isHotReload = ''
  if (data && data['failed_code'] === 'build_time_out') {
    isHotReload = false
  }
  if (data && data['failed_code'] === 'bundle_time_out') {
    isHotReload = true
  }
  if (isHotReload === '') {
    console.log('ErrorInVersionAPI')
  }

  const apppDownloadUrl = data['app_download_url'] || ''
  const bundleUrl = data['bundle_url'] || ''
  // const urlREG = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
  // if(!urlREG.test(bundleUrl)) {
  // return
  // }

  NavigationService.navigate('UpdateModal', {
    // 如果是 hotReload 则只过问 bundleVersion 信息
    isHotReload,
    needUpdate: true,
    msg: {
      downloadUrl: isHotReload ? bundleUrl : apppDownloadUrl,
      remark: data['remark'] || '',
      buildVersion: data['build_version'] || '',
      bundleVersion: data['bundle_version'] || '',
      newVersionName: '',    // api 需要补上
    }
  })
}


// const appKey = 'ba064212'; //'5cea1480',//ba064212   //9ec5c01b   //5cea1480
// const baseURL = 'http://192.168.8.142:3104/api'

const appKey = BuildConfig.appKey
const baseURL = BuildConfig.apiHost

export default creatAPI(baseURL, appKey)
