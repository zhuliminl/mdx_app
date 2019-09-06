/*
 * Created by Saul at 2019/06/05
 *
 *
 *
 */

import { combineReducers } from 'redux';

import glabalReducer from './globalReducer';

const rootReducer = combineReducers({
  globalState: glabalReducer,
});

export default rootReducer;
