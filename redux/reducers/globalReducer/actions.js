/*
 * Created by Saul at 2019/06/05
 *
 *
 *
 */

import {
  SET_TOKEN,
  SET_APP_INFO,
  SET_APP_VERSION
} from './actionType';

export const setToken = (token) => {
  return {
    type: SET_TOKEN,
    token,
  }
}

export const setAppInfo = (data) => {
  return {
    type: SET_APP_INFO,
    data,
  }
}

export const setAppVersion = (versionInfo) => {
  return {
    type: SET_APP_VERSION,
    versionInfo,
  }
}
