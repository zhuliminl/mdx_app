import PubSub from 'pubsub-js';
import React from 'react';
import { Animated, AsyncStorage, Easing, Linking, Platform, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import DeviceInfo from "react-native-device-info/deviceinfo";
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import BorrowCard from "../cpns/BorrowCard";
import BorrowFailed from "../cpns/BorrowFailed";
import HomeHeader from "../cpns/HomeHeader";
import Loading from "../cpns/small/Loading";
import SmallCard from "../cpns/SmallCard";
import { HotUpdateModule } from '../modules/HotUpdateModule';
import { setAppInfo } from '../redux/reducers/globalReducer/actions';
import { routes } from "../Routes";
import AnalyticsUtil from '../umeng/AnalyticsUtil';
import api from '../utils/api';
import { default as BuildConfig, default as config } from '../utils/nativeConfig';
import { statusToName } from '../utils/statusToName';
import { tm } from "../utils/theme";
import Toast from '../utils/toast';
import { HomeStyles } from "./HomeStyles";
import My from './My';
import UpdateModalScreen from './update/UpdateModal';


const moment = require('moment');

const styles = HomeStyles;

let aniRight = true;

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      showMy: null,
      fontLoaded: false,
      showStatus: 0,
      showLoading: false,
      showBorrowFailed: false,
      failedTitle: null,
      failedContent: null,
      disabledRed: false,
      borrowOrder: {},
      idBlack: false,
      overFee: {},
      fee: {},
      bank: null,
      service_contact: null,
      refreshing: false,
      isOverForBorrowCard: false,
      slogan: null,
      noticeAlertComponent: [],
      isReady: false,

    };
    AnalyticsUtil.onPageStart('首页');
  }

  async onRefresh() {
    this.setState({ refreshing: true });
    console.log('home refresh');
    AnalyticsUtil.onEvent("home_refresh");
    AnalyticsUtil.onEventObject("home_refresh_with_obj", { 'fuck': 'me' });
    setTimeout(async () => {
      await this.authCheck(false);
      this.setState({ refreshing: false });
      this.forceUpdate();
    }, 500);
  }

  showBlack() {
    this.setState({
      showBorrowFailed: true,
      failedTitle: '评分不足',
      failedContent: '很抱歉，您的综合评分不足，暂时无法借款，请继续保持良好的信用记录，下次再来试试吧'
    });


  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.navigation.state.params['statusName']) {
      case 'login':
        if (nextProps.navigation.state.params['params'] === true) {
          this.setState({ showStatus: 1 });
          this.authCheck();
        }
        break;

      case 'logout':
        if (nextProps.navigation.state.params['params'] === true) this.setState({ showStatus: 0, showMy: false });
        break;
      case 'auth':
        if (nextProps.navigation.state.params['params'] === true) this.setState({ showStatus: 2 });
        break;
      case 'borrow':
        if (nextProps.navigation.state.params['params'] === false) {
          this.showBlack();
        }
        break;
    }
  }




  componentWillUnmount() {

    AnalyticsUtil.onPageEnd("首页");
    if (this.sub) {
      PubSub.unsubscribe(this.sub);
    }
    this.willFocusSubscription.remove();
  }

  setUnLogin() {
    this.setState({ showStatus: 0 })
  }

  getAppVersion = () => {
    const data = HotUpdateModule.getConstants()
    const { appVersionInfoJSON } = data
    console.log('FIN version data', data)

    let appVersionInfo = {
      buildVersion: '',
      bundleVersion: '',
    }

    try {
      appVersionInfo = JSON.parse(appVersionInfoJSON)
    } catch (error) {
      console.log('appVersionInfoJSONParseError', error)
      // 从 BuildConfig 中获取默认的版本信息
      appVersionInfo.buildVersion = BuildConfig.buildVersion
      appVersionInfo.bundleVersion = BuildConfig.bundleVersion
    }
    if (!appVersionInfo.bundleVersion) {  // 如果 Native 返回空对象，则仍然取 Config 中的版本信息
      appVersionInfo.buildVersion = BuildConfig.buildVersion
      appVersionInfo.bundleVersion = BuildConfig.bundleVersion
    }
    return appVersionInfo
  }

  checkNeedAliPay = async () => {
    try {
      const resp = await api.get('/users/appkey')
      return resp && resp['alipay_auth'] == 1
    } catch (err) {
      console.log('checkNeedAliPay Error', err)
      return false
    }
  }

  setNeedAliPay = async () => {
    await this.setState({
      needAliPay: await this.checkNeedAliPay()
    })
  }

  async componentDidMount() {
    await this.setNeedAliPay()

    const appVersionInfo = this.getAppVersion()
    console.log("FIN appVersionInfo", appVersionInfo)

    const deviceInfo = {
      brand: DeviceInfo.getBrand(),
      bundleId: DeviceInfo.getBundleId(),
      carrier: DeviceInfo.getCarrier(),
      deviceId: DeviceInfo.getDeviceId(),
      deviceName: DeviceInfo.getDeviceName(),
      iPhone: Platform.OS === 'ios',
      android: Platform.OS !== 'ios',
      uniqueId: DeviceInfo.getUniqueID(),
      userAgent: DeviceInfo.getUserAgent(),
      version: DeviceInfo.getVersion(),        // app_version
      isEmulator: DeviceInfo.isEmulator(),
      isTablet: DeviceInfo.isTablet(),
      systemVersion: DeviceInfo.getSystemVersion(),
      systemName: DeviceInfo.getSystemName(),
      mac: await DeviceInfo.getMACAddress(),
      manufacturer: DeviceInfo.getManufacturer(),

      // 新的 api 接口需要的数据
      device_type: Platform.OS === 'ios' ? 1 : 2,
      buildNumber: DeviceInfo.getBuildNumber(),   // build_version
      // build_version: appVersionInfo.buildVersion,   // 当前版本号
      // 不能给编译版本持久化
      build_version: BuildConfig.buildVersion,   // 当前版本号
      bundle_version: appVersionInfo.bundleVersion, // 资源版本号
    };

    await AsyncStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
    console.log('FIN deviceInfo set ok')

    this.setState({ isReady: true })

    this.props.dispatch(setAppInfo({
      config,
      deviceInfo,
    }));


    try {
      let sid = await AsyncStorage.getItem('sid');
      if (sid) {
        const resp = await api.get('/users/init');
        AnalyticsUtil.onEventObject("get_init", resp);
        if (resp.has_alert && resp.has_alert === true) {
          console.log('has_alert');
          this.showNoticeAlert(resp.alert_info);

        }
      }
    } catch (e) {

    }


    SplashScreen.hide();



    this.setState({ fontLoaded: true });
    if (!this.sub) {
      this.sub = PubSub.subscribe('BACK_HOME', (msg, data) => {
        if (data === 'BorrowConfirm') {
          this.authCheck();
        }
        if (data === 'BorrowDetail') {
          this.authCheck();
        }
        if (data === 'Logout') {
          this.setState({ borrowOrder: {}, idBlack: false, fee: {}, showStatus: 0, bank: null });
          this.authCheck();
        }

        this.setState({ disabledRed: false });
      });

    }

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        console.log('willFocus', payload);
        this.setState({ disabledRed: false });
      }
    );

    this.authCheck();
  }


  openUrlDefaultBrowser(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Toast('打开链接错误，请联系客服');
      }
    });
  }

  async showNoticeAlert(alert_info) {
    console.log('do showNoticeAlert ');
    const noticeAlertComponent = [];
    let cancelBtn = null;
    const firstBtnStyle = [styles.btnTextOuter];
    const SecondBtnStyle = [styles.btnTextOuter];
    if (alert_info.allow_cancel && alert_info.allow_cancel === true) {
      cancelBtn = <TouchableOpacity onPress={() => { this.setState({ noticeAlertComponent: [] }) }} style={firstBtnStyle} key='cancelBtn'><Text style={styles.btnText}>{alert_info.cancel_text || '取消'}</Text></TouchableOpacity>;
    }

    let btnAreaBtns = [];
    if (cancelBtn) {
      btnAreaBtns.push(cancelBtn);
    }

    let okBtn = null;

    if (alert_info.ok_url) {
      okBtn = <TouchableOpacity onPress={() => { this.openUrlDefaultBrowser(alert_info.ok_url) }} style={SecondBtnStyle} key='okBtn'><Text style={styles.btnText}>{alert_info.ok_text || '确定'}</Text></TouchableOpacity>;
    }

    if (okBtn) {
      btnAreaBtns.push(okBtn);
    }

    // console.log('btnAreaBtns-------->', btnAreaBtns);

    if (btnAreaBtns.length > 1) {
      firstBtnStyle.push(styles.btnTextTwo);
      firstBtnStyle.push(styles.btnTextFirst);
      SecondBtnStyle.push(styles.btnTextTwo);
      SecondBtnStyle.push(styles.btnTextSecond);
    }

    let btnArea = null;

    if (btnAreaBtns.length > 0) {
      btnArea = <View style={styles.btnArea}>{btnAreaBtns}</View>;
    }

    let titleArea = <Text style={styles.titleText}>{alert_info.title_text || '提示'}</Text>;

    let bodyArea = null;

    if (alert_info.body_content) {
      bodyArea = <Text style={styles.bodyText} selectable>{alert_info.body_content}</Text>
    }

    noticeAlertComponent.push(<View key='noticeAlertOuter' style={styles.noticeAlertOuter}><View style={styles.noticeAlertPanel}>{titleArea}{bodyArea}{btnArea}</View></View>);


    this.setState({ noticeAlertComponent });
  }


  checkOverForBorrowCard(order) {
    if (!(order && order.ok_at)) return;
    const endDate = moment(moment(order.ok_at).add(order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00'));
    const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
    this.setState({ isOverForBorrowCard: endDate.unix() < nowDate.unix() });
  }



  async authCheck(showLoading = true) {
    await this.setNeedAliPay()

    if (!this.state.slogan) {
      const sloganResp = await api.get('/users/slogan');
      if (sloganResp && sloganResp['success'] === true) {
        this.setState({ slogan: sloganResp['slogan'] });
      }
    }

    const sid = await AsyncStorage.getItem('sid');
    if (!sid) return;


    if (showLoading) this.showLoading();

    let authSuccess = false;
    let borrowOrder = null;
    let resp = await api.get('/users/status');

    if (resp && resp['success'] !== true) {
      this.setState({ showStatus: 0 });
    }

    console.log('FIN this.state', this.state)
    if (!this.state.needAliPay) {
      resp['alipay_status'] = true
    }

    if (resp && resp['success'] === true && resp['ud_status'] === true && resp['carrier_status'] === true && resp['alipay_status'] === true && resp['bank_status'] === true && resp['emergency_contact_status'] === true) {
      authSuccess = true;
      //await AsyncStorage.setItem('authStatus', 'true');
    }

    if (resp && resp['success'] === true && resp['fee']) {
      await this.setState({ fee: resp['fee'] });
    }

    if (resp && resp['success'] === true && resp['over_fee']) {
      await this.setState({ overFee: resp['over_fee'] });
    }

    if (resp && resp['success'] === true && resp['bank']) {
      await this.setState({ bank: resp['bank'] });
    }


    if (resp && resp['success'] === true && resp['service_contact']) {
      this.setState({ service_contact: resp['service_contact'] });
      await AsyncStorage.setItem('service_contact', JSON.stringify(resp['service_contact']));
    }

    if (resp) {
      await this.setState({ isBlack: resp['is_black'] === true });
    }

    if (resp && resp['borrow_order']) {
      borrowOrder = resp['borrow_order'];
      await this.setState({ borrowOrder });
      this.checkOverForBorrowCard(borrowOrder);
    } else {
      await this.setState({ borrowOrder: {} });
    }


    // let user = await AsyncStorage.getItem('mobile');
    // let sid = await AsyncStorage.getItem('sid');
    //let authSuccess = await AsyncStorage.getItem('authStatus');
    this.hideLoading();
    if (resp['success'] !== true) {
      return;
    }

    //showStatus
    //0 需要登录
    //1 需要认证
    //2 可以借款
    //3 需要还款
    if (authSuccess) {
      if (borrowOrder) {
        if (borrowOrder.status === 4) {
          return await this.setState({ showStatus: 2 });
        }
        return await this.setState({ showStatus: 3 });
      }
      return await this.setState({ showStatus: 2 });
    }
    return await this.setState({ showStatus: 1 });
  }


  mainComponents = {
    ios: ScrollView,
    android: View
  };

  showLoading() {
    this.setState({ showLoading: true })
  }

  hideLoading() {
    this.setState({ showLoading: false });
  }

  getSmallCard() {
    if (this.state.borrowOrder.hasOwnProperty('id')) {
      switch (this.state.borrowOrder.status) {
        case 4:
          return null;
        default:
          return <SmallCard fee={this.state.fee} overFee={this.state.overFee} order={this.state.borrowOrder} onPress={() => {
            this.props.navigation.push('BorrowDetail', {
              statusName: statusToName(this.state.borrowOrder.status),
              orderId: this.state.borrowOrder['out_id'],
              backHome: true
            });
          }} />
      }

    }
    return null
  }

  render() {
    //const MainTagName = Platform.OS === 'ios' ? this.mainComponents['ios'] : this.mainComponents['android'];
    return (
      <View style={[styles.container, styles.containerAndroid]}>

        <ScrollView refreshControl={
          <RefreshControl
            progressBackgroundColor='#ddd'
            style={{
              zIndex: 999,
            }}
            refreshing={this.state.refreshing}
            onRefresh={() => { this.onRefresh() }} />
        }

          alwaysBounceVertical={!this.state.showMy === true}
          style={[styles.container]}
          contentContainerStyle={[styles.container, styles.containerAndroid]}>
          <StatusBar
            backgroundColor={tm.mainColor}
            barStyle="light-content"
            hidden={this.state.refreshing === true} />


          <HomeHeader slogan={this.state.slogan} onRightClick={this.goMsg.bind(this)} onLeftClick={this.goMy.bind(this)} />
          {this.state.isReady &&
            <BorrowCard
              fee={this.state.fee}
              isOver={this.state.isOverForBorrowCard}
              order={this.state.borrowOrder}
              disabled={this.state.disabledRed}
              showStatus={this.state.showStatus}
              navigation={this.props.navigation}
              onPress={(ss) => {
                this.goRedBtn(ss)
              }} />
          }

          {this.getSmallCard()}
          <My show={this.state.showMy}
            showStatus={this.state.showStatus}
            order={this.state.borrowOrder}
            navigation={this.props.navigation}
            bank={this.state.bank}
            sc={this.state.service_contact}
            onClose={() => {
              this.setState({ showMy: false })
            }} />
          <Loading show={this.state.showLoading} text='加载中...' />
          <BorrowFailed title={this.state.failedTitle} content={this.state.failedContent} show={this.state.showBorrowFailed === true} doHide={() => {
            this.setState({ showBorrowFailed: false })
          }} />
        </ScrollView>
        {this.state.noticeAlertComponent}

      </View>
    );
  }
  //
  async goRedBtn(ss) {
    switch (ss) {
      case 1:
        aniRight = true;
        this.goAuthenticationCenter();
        break;
      case 0:
        aniRight = false;
        this.props.navigation.push('Logup');
        break;
      case 2:

        if (this.state.isBlack === true) {
          return this.showBlack();
        }

        await this.setState({ disabledRed: true });
        aniRight = true;
        this.props.navigation.push('BorrowCenter');
        break;
      case 3:
        if (this.state.borrowOrder) {
          switch (this.state.borrowOrder['status']) {
            case 1:
              return this.setState({
                showBorrowFailed: true,
                failedTitle: '提示',
                failedContent: '很抱歉，您目前有一笔借款正在放款中，请耐心等待。'
              });
            case 0:
              return this.setState({
                showBorrowFailed: true,
                failedTitle: '提示',
                failedContent: '很抱歉，您目前有一笔借款正在审核中，请耐心等待。'
              });
            case 2:
              if (this.state.borrowOrder.is_backing === 1 || this.state.borrowOrder.is_backing === true) {
                this.props.navigation.push('BackSuccess', { order: this.state.borrowOrder });
              } else {
                this.props.navigation.push('Back', { order: this.state.borrowOrder });
              }
          }
        }
    }

  }

  goAuthenticationCenter() {
    this.props.navigation.push('AuthenticationCenter');
  }

  goMy() {
    if (this.state.showStatus === 0) {
      aniRight = false;
      return this.props.navigation.push('Logup');
    }
    aniRight = true;
    this.setState({ showMy: true });

  }

  goMsg() {
    if (this.state.showStatus === 0) {
      aniRight = false;
      return this.props.navigation.push('Logup');
    }

    aniRight = true;
    this.props.navigation.push('Messages');

  }

}


const getPageAni = () => {
  if (aniRight) {
    return {
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateX }] };
      },
    };
  } else {
    return {
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    };
  }

};


const HomeWithRedux = connect()(Home);


const MainStack = createStackNavigator(
  Object.assign({
    Home: {
      screen: HomeWithRedux,
    }
  }, routes),
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    transitionConfig: () => (getPageAni())
  }
);


export default createStackNavigator({
  Main: {
    screen: MainStack,
  },
  UpdateModal: {
    screen: UpdateModalScreen,
  }
},
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      // backgroundColor: 'transparent',
      backgroundColor: '#00000075',
      opacity: 1,
    },
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      },
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
      },
    }),
  }
)
