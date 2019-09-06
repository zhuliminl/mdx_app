/*
 * Created by Saul at 2019/05/28
 *
 * 更新进程展示
 *
 */

import React from 'react';
import { DeviceEventEmitter, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Permissions from 'react-native-permissions';
import RNRestart from 'react-native-restart';
import { connect } from 'react-redux';
import { hotUpdateManagerEmitter, HotUpdateModule } from '../../modules/HotUpdateModule';
import BuildConfig from '../../utils/nativeConfig';
import { p } from "../../utils/p";
import { tm } from '../../utils/theme';
import Toast from '../../utils/toast';

class UpdateProcessCard extends React.Component {
  state = {
    processPercent: 0,
    fileAccessAllowedInAndroid: true,
  }

  componentDidMount = () => {
    if (Platform.OS === 'ios') {
      this.hotUpdateForIOS()
    } else {
      // 先询问访问文件的权限
      this.handleAndroidUpdateWithPermission()
      // 以前版本，可随时恢复
      // this.hotUpdateForAndroid()
    }
  }

  handleAndroidUpdateWithPermission = async () => {
    try {
      const r = await Permissions.check('storage')
      switch (r) {
        case 'authorized':
          this.hotUpdateForAndroid()
          break;
        case 'denied':   // 用户至少拒绝过一次！ IOS 将会直接关闭询问功能， Andriod 则会在用户选择永不询问的情况下，关闭询问功能
          Toast('请去设置页面，开启文件访问权限')
          break;
        case 'restricted':  // Android 用选择永不询问的情况
          Toast('请去设置页面，开启文件访问权限')
          break;
        case 'undetermined':  // 首次检查
          Permissions.request('storage').then(response => {
            console.log('FIN requestPermission response', response)
            if (response === 'denied' || response === 'restricted') {
              Toast('请去设置页面，开启文件访问权限')
            }
            if (response === 'authorized') {
              this.hotUpdateForAndroid()
            }
          })
          break;
        default:
          Toast('检查授权意外')
      }
    } catch (err) {
      console.log('热更新权限申请错误', err)
    }
  }

  // 重启 app，唤醒更新
  restartApp = () => {
    RNRestart.Restart();
  }

  resetAppVersionInfo = () => {
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
      // 从 BuildConfig 中获取默认的版本信息
      appVersionInfo.buildVersion = BuildConfig.buildVersion
      appVersionInfo.bundleVersion = BuildConfig.bundleVersion
    }
    if (!appVersionInfo.bundleVersion) {  // 如果 Native 返回空对象，则仍然取 Config 中的版本信息
      appVersionInfo.buildVersion = BuildConfig.buildVersion
      appVersionInfo.bundleVersion = BuildConfig.bundleVersion
    }
    console.log('FIN old appVersionInfo', appVersionInfo)

    const { newVersionMsg } = this.props

    let newVersionInfo = {
      buildVersion: appVersionInfo.buildVersion,
      bundleVersion: newVersionMsg.bundleVersion,
    }
    console.log("FIN new versionInfo", newVersionInfo)
    this.setAppVersion(newVersionInfo)

  }

  // redux 本地最好也维护一份新版本信息
  setAppVersion = (data) => {
    HotUpdateModule.setAppVersion(JSON.stringify(data))
  }

  hotUpdateForIOS = () => {
    const { newVersionMsg } = this.props
    const { downloadUrl } = newVersionMsg
    HotUpdateModule.startHotUpdate(downloadUrl)

    this.subscription1 = hotUpdateManagerEmitter.addListener(
      'UpdateProcess',
      (data) => {
        this.setState({
          processPercent: data['process_percent']
        })
      }
    )

    this.subscription2 = hotUpdateManagerEmitter.addListener(
      'UpdateSuccess',
      (data) => {
        console.log('FIN', data['message'])
        this.resetAppVersionInfo()
        this.restartApp()
      }
    )

    this.subscription3 = hotUpdateManagerEmitter.addListener(
      'UpdateFailure',
      (data) => {
        console.log('FIN', data['message'])
      }
    )
  }

  hotUpdateForAndroid = () => {
    const { newVersionMsg } = this.props
    const { downloadUrl } = newVersionMsg
    HotUpdateModule.startHotUpdate(downloadUrl)

    this.subscription1 = DeviceEventEmitter.addListener('UpdateSuccess', (data) => {
      console.log('FIN download success with message data', data)
      this.resetAppVersionInfo()
    });

    this.subscription2 = DeviceEventEmitter.addListener('UpdateProcess', (data) => {
      this.setState({
        processPercent: +data['process_percent']
      })
    });

    this.subscription3 = DeviceEventEmitter.addListener('FileOpenRefused', (data) => {
      console.log('FIN user refused access storage')
      this.setState({
        fileAccessAllowedInAndroid: false,
      })
    });
  }

  componentWillUnmount = () => {
    this.subscription1 && this.subscription1.remove()
    this.subscription2 && this.subscription2.remove()
    this.subscription3 && this.subscription3.remove()
  }


  render() {
    const { fileAccessAllowedInAndroid } = this.state
    if (!fileAccessAllowedInAndroid) {
      return null
    }

    let processPercentStr = ''
    if (Platform.OS === 'ios') {
      processPercentStr = (this.state.processPercent * 100).toFixed(2) + '%'
    } else {
      processPercentStr = (this.state.processPercent).toFixed(2) + '%'
    }

    return (
      <View style={styles.cardWrapper}>
        <Text style={styles.titleText}>正在下载最新版本</Text>
        <Text style={styles.processText}>
          已完成{processPercentStr}
        </Text>
        <View style={styles.processBarWrapper}>
          <View style={
            [styles.processBar, { width: processPercentStr }]
          }></View>
        </View>
        <TouchableOpacity
          style={styles.silentDownloadBtn}
          onPress={() => {
          }}
        >
          <Text style={styles.silentDownloadBtnText}>正在更新</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  cardWrapper: {
    margin: p.td(100),
    marginTop: p.td(240),
    borderRadius: p.td(15),
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  titleText: {
    textAlign: 'center',
    lineHeight: p.td(90),
    backgroundColor: tm.mainColor,
    color: '#FFF',
    fontSize: p.td(34),
    lineHeight: p.td(120),
  },
  processText: {
    textAlign: 'center',
    lineHeight: p.td(200),
    color: '#333',
    fontSize: p.td(30),
  },
  processBarWrapper: {
    height: p.td(16),
    marginLeft: p.td(60),
    marginRight: p.td(60),
    backgroundColor: '#EEE',
    borderRadius: p.td(8),
  },
  processBar: {
    position: 'absolute',
    height: p.td(16),
    borderRadius: p.td(8),
    backgroundColor: tm.mainColor,
  },
  silentDownloadBtn: {
    marginTop: p.td(100),
    borderRadius: p.td(15),
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  silentDownloadBtnText: {
    lineHeight: p.td(100),
    textAlign: 'center',
    color: tm.mainColor,
    fontSize: p.td(34),
  }
})

export default connect()(UpdateProcessCard)
