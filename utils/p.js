
import { Dimensions } from 'react-native';

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('screen').height;

// 设计稿宽度（这里为640px），单位 px
const uiWidthPx = 750;

const themeName = 'red';


export const p = {
  td: (uiElePx) => {
    //console.warn(uiElePx, deviceWidthDp, uiWidthPx, deviceHeightDp, uiElePx * deviceWidthDp / uiWidthPx);
    return uiElePx * deviceWidthDp / uiWidthPx;
  },
  h: deviceHeightDp,
  tn: themeName,
};
