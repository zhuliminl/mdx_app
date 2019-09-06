/*
 * Created by Saul at 2019/06/05
 *
 * redux 储存初始化
 *
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { createLogger } from 'redux-logger';

import rootReducer from './reducers';


const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});


const persistConfig = {
  key: 'globalState',
  storage,
  blacklist: ['globalState']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const preloadedState = {};
const loggerMiddleware = createLogger();


let store = createStore(
  persistedReducer,
  preloadedState,
  composeEnhancers(
    applyMiddleware(
      loggerMiddleware,
    ),
  )
)

let persistor = persistStore(store)

export {
  store,
  persistor
}
