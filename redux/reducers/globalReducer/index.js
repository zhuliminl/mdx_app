/*
 * Created by Saul at 2019/06/05
 *
 * 全局状态的规约函数
 *
 */


import {
  SET_TOKEN,
  SET_APP_INFO,
  SET_APP_VERSION
} from './actionType';

const initState = {
  foo: 'test',
  appInfo: {},
}

export default (state = initState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        auth: {
          token: action.token,
        }
      }
    case SET_APP_INFO:
      return {
        ...state,
        appInfo: action.data,
      }
    case SET_APP_VERSION:
      return {
        ...state,
        appInfo: action.versionInfo
      }
    default:
      return state;
  }
}
