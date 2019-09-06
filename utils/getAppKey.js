import { Platform } from 'react-native';
import BuildConfig from './nativeConfig'

export const getAppKey = () => {
  return BuildConfig.appKey
};
