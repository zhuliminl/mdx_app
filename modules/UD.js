import {NativeEventEmitter,  NativeModules } from 'react-native';
const {UDModule} = NativeModules;
const emitter = new NativeEventEmitter(UDModule);
export const UD = UDModule;
export const UDEmitter = emitter;