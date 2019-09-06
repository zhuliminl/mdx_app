import React from 'react';
import { AppRegistry, AsyncStorage, StatusBar, StyleSheet, Text, View, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import Home from './pages/Home';
import _Home from './pages/home'
import { store } from './redux/createStore';
import PushUtil from './umeng/PushUtil';
import bugsnag from './utils/bugsnag';
import ErrorBoundary from './utils/ErrorBoundary';
import NavigationService from './utils/NavigationService';
import TestZone from './utils/TestZone';


const openTestZone = false

console.disableYellowBox = true;

// 忽略部分非致命性的警告
YellowBox.ignoreWarnings(['Warning: ', 'Require cycle: ']);

Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false });

class App extends React.Component {
  async componentDidMount() {

    const mobile = await AsyncStorage.getItem('mobile')
    const uid = await AsyncStorage.getItem('uid')
    if (mobile && uid) {
      // ID, username, email
      bugsnag.setUser(mobile, uid, '')
    }

    // this.initPush()
  }

  initPush = () => {
    // PushUtil.appInfo(data => {
    //   console.log('FIN appInfo', data)
    // })
    // console.log('FIN PushUtil', PushUtil)
  }

  render() {
    if (openTestZone) {
      return <TestZone />
    }
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={'#FFF'}
          barStyle="light-content"
        />
        <ErrorBoundary>
          <Provider store={store}>
            <_Home
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef)
              }}
            />
          </Provider>
        </ErrorBoundary>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00050C'
  }
});

AppRegistry.registerComponent('TheoryFinTechApp', () => App, true);
