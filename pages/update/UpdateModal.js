/*
 * Created by Saul at 2019/05/28
 *
 * 冷热更新模态窗
 *
 */
import React from 'react';
import { Image, Linking, NativeModules, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { p } from "../../utils/p";
import { tm } from '../../utils/theme';
import Toast from '../../utils/toast';
import UpdateProcessCard from './UpdateProcessCard';
const HotUpdateModule = NativeModules.HotUpdateModule


class UpdateModalScreen extends React.Component {
  state = {
    readyForHotReload: false
  }

  openUrlDefaultBrowser(url) {
    Linking.canOpenURL(url).then(supported => {
      console.log('open url defualt brower supported', supported)
      if (supported) {
        Linking.openURL(url);
      } else {
        Toast('打开链接错误，请联系客服');
      }
    });
  }


  handleUpdateClick() {
    const { navigation } = this.props
    const isHotReload = navigation.getParam('isHotReload', false);

    // 冷更新
    if (!isHotReload) {
      const msg = navigation.getParam('msg', {});
      const { downloadUrl } = msg
      return this.openUrlDefaultBrowser(downloadUrl)
    }

    // 热更新
    this.setState({
      readyForHotReload: true,
    })

  }

  // 测试需要
  deleteLastUpdate = () => {
    HotUpdateModule.deleteLastUpdate()
  }

  render() {
    const { navigation } = this.props
    const isHotReload = navigation.getParam('isHotReload', false);
    const msg = navigation.getParam('msg', {});
    let { downloadUrl, remark, newVersionName, bundleVersion } = msg

    const { readyForHotReload } = this.state
    if (readyForHotReload) {
      return <UpdateProcessCard newVersionMsg={{ downloadUrl, remark, newVersionName, bundleVersion }} />
    }

    return (
      <View style={styles.cardWrapper}>
        <Image
          style={styles.cardHeaderBg}
          source={tm.icons.upgradeBg}
        />
        <Text style={styles.titleText}>发现新版本</Text>
        <Text style={styles.versionNameText}>{newVersionName}</Text>
        <Text style={styles.remarkText}>{remark}</Text>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => {
            this.handleUpdateClick()
          }}
        >
          <Text style={styles.updateBtnText}>立即更新</Text>
        </TouchableOpacity>

        {/* 清除上次更新
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => {
            this.deleteLastUpdate()
          }}
        >
          <Text style={styles.updateBtnText}>clear last version</Text>
        </TouchableOpacity>
            */}
      </View>
    );
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
  cardHeaderBg: {
    width: null,
    height: p.td(140),
  },
  titleText: {
    position: 'absolute',
    top: p.td(23),
    left: p.td(40),
    fontSize: p.td(38),
    color: '#FFF',
  },
  versionNameText: {
    position: 'absolute',
    top: p.td(70),
    left: p.td(40),
    fontSize: p.td(32),
    color: '#FFF',
  },
  remarkText: {
    margin: p.td(40),
    marginTop: p.td(50),
    fontSize: p.td(34),
    color: '#666',
    minHeight: p.td(200),
  },
  updateBtn: {
    borderRadius: p.td(15),
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  updateBtnText: {
    lineHeight: p.td(100),
    textAlign: 'center',
    color: tm.mainColor,
    fontSize: p.td(34),
  }
})

export default UpdateModalScreen
