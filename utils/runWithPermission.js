import Permissions from 'react-native-permissions';
import { Alert, Linking } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Toast from './toast'



export const showIOSContactAlert = () => {
  Alert.alert('提示', '请在iPhone的"设置-隐私-通讯录"选项中允许当前应用访问您的通讯录',
    [{ text: '确定', onPress: async () => { Linking.openURL('app-settings:') } },]
  )
};

export const showAndroidContactAlert = () => {
  Alert.alert('提示', '请允许当前应用访问您的通讯录',
    [{ text: '确定', onPress: async () => { AndroidOpenSettings.appDetailsSettings(); } },]
  )
};

export const showAndroidSmsAlert = () => {
  Alert.alert('提示', '设置紧急联系人请允许平台访问您的短信',
    [{ text: '确定', onPress: async () => { AndroidOpenSettings.appDetailsSettings() } },]
  )
};


const requestPermission = (type, onFail, onSuccess) => {
  Permissions.request(type).then(response => {
    console.log('FIN requestPermission response', response)
    if (response === 'denied' || response === 'restricted') {
      // 打开设置
      onFail && onFail()
    }
    if (response === 'authorized') {
      onSuccess && onSuccess()
    }
  })
}

export const runWithPermission = async (permissionType, onFail, onSuccess) => {
  console.log('FIN 检查权限')
  try {
    const r = await Permissions.check(permissionType)
    console.log('FIN r', r)
    switch (r) {
      case 'authorized':
        onSuccess()
        break;
      case 'denied':   // 用户至少拒绝过一次！ IOS 将会直接关闭询问功能， Andriod 则会在用户选择永不询问的情况下，关闭询问功能
        requestPermission(permissionType, onFail, onSuccess)
        break;
      case 'restricted':  // Android 用选择永不询问的情况
        // Toast('是永不询问的拒绝')
        requestPermission(permissionType, onFail, onSuccess)
        break;
      case 'undetermined':  // 首次检查
        // Toast('用户未决定')
        requestPermission(permissionType, onFail, onSuccess)
        break;
      default:
        Toast('检查授权意外')
    }

  } catch (err) {
    console.log('FIN PermissionsCheckError', err)
  }
}


