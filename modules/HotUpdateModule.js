import { NativeModules, NativeEventEmitter } from 'react-native';


export const HotUpdateModule = NativeModules.HotUpdateModule
export const hotUpdateManagerEmitter = new NativeEventEmitter(HotUpdateModule)
