import {NativeEventEmitter,  NativeModules } from 'react-native';
const {FYModule} = NativeModules;

const emitter = new NativeEventEmitter(FYModule);

export const FY = FYModule;

export const FYEmiter = emitter;
