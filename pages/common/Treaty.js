/*
 * Created by Saul at 2019/05/28
 *
 * 条款协议入口
 *
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HotUpdateModule } from '../../modules/HotUpdateModule';
import BuildConfig from '../../utils/nativeConfig';
import { p } from "../../utils/p";

class Treaty extends React.Component {
  getAppVersion = () => {
    const data = HotUpdateModule.getConstants()
    const { appVersionInfoJSON } = data

    let appVersionInfo = {
      buildVersion: '',
      bundleVersion: '',
    }

    try {
      appVersionInfo = JSON.parse(appVersionInfoJSON)
    } catch (error) {
      console.log('appVersionInfoJSONParseError', error)
      appVersionInfo.buildVersion = BuildConfig.buildVersion
      appVersionInfo.bundleVersion = BuildConfig.bundleVersion
    }
    if (!appVersionInfo.bundleVersion) {
      appVersionInfo.buildVersion = BuildConfig.buildVersion
      appVersionInfo.bundleVersion = BuildConfig.bundleVersion
    }
    return appVersionInfo
  }

  render() {
    const appVersionInfo = this.getAppVersion()
    return (
      <React.Fragment>
        <View style={styles.textLine}>
          <Text style={styles.textHo}>注册/登录即表示同意《</Text>
          <TouchableOpacity
            onPress={this.props.onPress}
          >
            <Text style={styles.clickText}>注册协议</Text>
          </TouchableOpacity>
          <Text style={styles.textHo}>》</Text>
        </View>
        <View style={styles.versionWrapper}>
          <Text style={styles.versionText}>版本号{this.props.version}</Text>
          <Text style={styles.versionText}>bundle {appVersionInfo.bundleVersion || ''}</Text>
        </View>
      </React.Fragment>
    )
  }
}


const styles = StyleSheet.create({
  textLine: {
    position: 'absolute',
    width: p.td(750),
    left: 0,
    bottom: p.td(120),
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textHo: {
    fontSize: p.td(32),
    color: '#fff',
    lineHeight: p.td(42),
  },
  versionWrapper: {
    opacity: 0.8,
    position: 'absolute',
    bottom: p.td(40),
  },
  versionText: {
    fontSize: p.td(28),
    textAlign: 'center',
    color: '#fff',
  },
  clickText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: p.td(30),
    lineHeight: p.td(42),
  },
})


export default Treaty;
