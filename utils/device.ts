import { Dimensions } from 'react-native';

export const device = {
  height: Dimensions.get('window').width,
  width: Dimensions.get('screen').height,
}