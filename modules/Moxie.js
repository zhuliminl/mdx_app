import {NativeEventEmitter,  NativeModules } from 'react-native';
const {MoxieModule} = NativeModules;

const emitter = new NativeEventEmitter(MoxieModule);

export const Moxie = MoxieModule;

export const MoxieEmiter = emitter;
