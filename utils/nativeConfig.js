/*
 * Created by Saul at 2019/06/05
 *
 * 从 Native 环境获取 app 信息, 具体包括
 *
 * 1. 指定颜色主题
 * 2. app 名称
 * 4. api Host
 * 3. 商户 appKey
 * 3. 商户名称
 * 5. 版本号名称
 *
 */

import { Platform } from 'react-native';
const BuildConfig = require('react-native-build-config');

function getConfig() {
  return Platform.OS === "ios" ? getConfigFromIOS() : getConfigFromAndroid();
}

function getConfigFromAndroid() {
  const config = {
    platform: 'android',
    versionName: BuildConfig.VERSION_NAME,
    versionCode: BuildConfig.VERSION_CODE,
    apiHost: BuildConfig.HOST,
    flavor: BuildConfig.FLAVOR,
    debug: BuildConfig.DEBUG,
    appKey: BuildConfig.APP_KEY,
    appId: BuildConfig.APPLICATION_ID,
    appName: BuildConfig.APP_NAME || 'app 名称',

    // theme
    theme: BuildConfig.THEME || 'red',
    bannerType: BuildConfig.BANNER_TYPE || 'typeB',

    // 需要 xcode 和 gradle 添加字段以支持
    buildVersion: BuildConfig.VERSION_CODE,
    bundleVersion: BuildConfig.BASE_BUNDLE_VERSION,
    isSilentAuthMode: true,
  };
  return config;
}

function getConfigFromIOS() {
  const iosConfig = require('NativeModules').ConfigModule;
  const data = iosConfig.getConstants();
  return {
    platform: 'ios',
    versionName: data.VERSION_NAME || "版本名称",
    versionCode: data.VERSION_CODE || "版本号",
    apiHost: data.API_HOST || 'apiHost',
    flavor: data.FLAVOR || 'flavor',
    debug: data.DEBUG || true,
    appKey: data.APP_KEY || "appKey",
    appId: data.APP_ID || "appId",
    appName: data.APP_NAME || 'app 名称',

    // theme
    theme: data.APP_THEME || 'red',
    bannerType: data.BANNER_TYPE || 'typeB',

    // 需要 xcode 和 gradle 添加字段以支持
    buildVersion: data.VERSION_CODE,
    bundleVersion: +data.BASE_BUNDLE_VERSION,    // 当前版本号下的基础 bundleVersion，在 app 的热更新中会在 RN 中不断覆盖，但 config 中保持不变
    isSilentAuthMode: true,
  }
}


export default getConfig();
