import * as React from 'react';
import { View, ScrollView, StyleSheet, Text, Animated, Easing, StatusBar, RefreshControl, AsyncStorage } from 'react-native';
import { device } from '@/utils/device'
import SplashScreen from 'react-native-splash-screen';
import HomeHeader from './home-header'
import HomeBg from './home-bg'
import Slogan from './slogan'
import BorrowingLimitCard from './borrowing-limit-card'
import WaitingReturn from './waiting-return'
import HomeBtn from './home-btn'
import { routes } from '../../Routes'
import { NavigationScreenProp, NavigationEvents, NavigationNavigatorProps, NavigationTransitionProps, createStackNavigator } from 'react-navigation'
import UpdateModalScreen from '../update/UpdateModal';
import My from '../My'
import toast from '@/utils/toast';
import AnalyticsUtil from '../../umeng/AnalyticsUtil'
import api from '@/utils/api'

export interface HomeProps extends NavigationTransitionProps {
}

export interface HomeState {
}

class HomeScreen extends React.Component<HomeProps, HomeState> {
  state = {
    showMy: false,
    refreshing: false,
    needAliPay: true,
    slogan: null,
    showStatus: 0,

    fee: null,
    overFee: null,
    bank: null,
    service_contact: null,
    is_black: null,
    borrowOrder: null,
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    console.log('home refresh');
    // ====================== 统计 ==========================
    AnalyticsUtil.onEvent("home_refresh");
    AnalyticsUtil.onEventObject("home_refresh_with_obj", { 'fuck': 'me' });

    // ====================== 刷新检查认证 ====================
    await this.authCheck()
    this.setState({ refreshing: false });
  }

  // 检查用户认证状态
  authCheck = async () => {
    // ====================== 设定是否需要检查支付宝认证 =========
    await this.setNeedAliPay()
    // ====================== 设定口号 ========================
    await this.setSlogan()

    const sid = await AsyncStorage.getItem('sid')
    console.log('FIN 如果没有 sid，则直接退出检查', sid)
    if (!sid) return

    // ====================== 拦截用户首页状态: 需要登录，需要认证，需要还款，可以借款 ========================
    await this.setHomeStatus()
    console.log('FIN state', this.state)


  }

  checkNeedAliPay = async () => {
    try {
      const resp: any = await api.get('/users/appkey')
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

  setSlogan = async () => {
    if (!this.state.slogan) {
      try {
        const sloganResp: any = await api.get('/users/slogan');
        if (sloganResp && sloganResp['success'] === true) {
          this.setState({ slogan: sloganResp['slogan'] });
        }
      } catch (err) {
        console.log('FIN getSloganError', err)
      }
    }
  }

  //showStatus
  //0 需要登录
  //1 需要认证
  //2 可以借款
  //3 需要还款
  setHomeStatus = async () => {
    try {
      let authSuccess = false
      let borrowOrder = null

      let resp: any = await api.get('/users/status')
      // 如果获取用户信息失败，则设定为需要登录
      if (resp && resp['success'] !== true) {
        this.setState({ showStatus: 0 });
      }

      // 以下全都是数据储存设定
      if (!this.state.needAliPay) {
        resp['alipay_status'] = true
      }

      // 认证通过状态确定
      if (resp && resp['success'] === true && resp['ud_status'] === true && resp['carrier_status'] === true && resp['alipay_status'] === true && resp['bank_status'] === true && resp['emergency_contact_status'] === true) {
        authSuccess = true;
        await AsyncStorage.setItem('authStatus', 'true');
      }

      // fee
      if (resp && resp['success'] === true && resp['fee']) {
        await this.setState({ fee: resp['fee'] });
      }

      // over_fee
      if (resp && resp['success'] === true && resp['over_fee']) {
        await this.setState({ overFee: resp['over_fee'] });
      }

      // bank
      if (resp && resp['success'] === true && resp['bank']) {
        await this.setState({ bank: resp['bank'] });
      }

      // service_contact
      if (resp && resp['success'] === true && resp['service_contact']) {
        this.setState({ service_contact: resp['service_contact'] });
        await AsyncStorage.setItem('service_contact', JSON.stringify(resp['service_contact']));
      }

      // is_black
      if (resp) {
        await this.setState({ isBlack: resp['is_black'] === true });
      }

      // 借款单，借了才有该数据
      if (resp && resp['borrow_order']) {
        borrowOrder = resp['borrow_order'];
        console.log('FIN 借款订单', borrowOrder)
        await this.setState({ borrowOrder });
        // this.checkOverForBorrowCard(borrowOrder);
      } else {
        await this.setState({ borrowOrder: {} });
      }
      console.log('FIN state', this.state)



    } catch (err) {
      console.log('FIN getUserStatusError', err)
    }


  }

  componentDidMount = () => {
    SplashScreen.hide()
    this.setSlogan()
    this.authCheck()

    // 开发中直接去正在开发的页面
    // const { navigation } = this.props
    // navigation.navigate('Waiting')

  }

  // 打开侧边栏
  handleOnHeaderLeftClick = () => {
    // 如果没有登录，则跳转登录
    this.setState({ showMy: true });
  }

  // 去信息页面
  handleOnHeaderRightClick = () => {
    const { navigation } = this.props
    // 如果没有登录，则跳转登录，否则跳转信息
    const logined = true
    if (logined) {
      return navigation && navigation.push('Messages')
    }
  }

  // 提额
  handleOnUpgradeBtnPress = () => {
    toast('提额')
  }
  // 还款
  handleOnReturnBtnPress = () => {
    toast('还款')
  }

  // 立即登录
  handleOnLoginBtnPress = () => {
    const { navigation } = this.props
    navigation.push('Logup')
  }

  // 立即认证激活
  handleOnAuthBtnPress = () => {
    toast('激活')
  }

  handleOnPageFocus = (payload: any) => {
    console.log('FIN pageFocus', payload)
    const { state = {} } = payload
    const { params = {} } = state
    console.log('FIN paramse', params)
    if (params && params['statusName'] === 'login' && params['params']) {
      this.setState({ showStatus: 1, })
      this.authCheck()
    }

    if (params && params['statusName'] === 'logout' && params['params']) {
      console.log('FIN 退出登录')
      this.setState({ showStatus: 0, showMy: false })
    }

  }

  public render() {
    const { slogan = null as any } = this.state
    return (
      <View
        style={styles.container}
      >
        <NavigationEvents
          // onWillFocus={payload => console.log('will focus', payload)}
          onDidFocus={this.handleOnPageFocus}
        // onWillBlur={payload => console.log('will blur', payload)}
        // onDidBlur={payload => console.log('did blur', payload)}
        />
        <StatusBar
          backgroundColor={'transparent'}
          translucent
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              progressBackgroundColor='#ddd'
              style={{ zIndex: 999, }}
              refreshing={this.state.refreshing}
              onRefresh={() => { this.onRefresh() }} />
          }
          style={styles.scrollWraper}
          alwaysBounceVertical={!this.state.showMy === true}
        >
          <HomeHeader onLeftClick={this.handleOnHeaderLeftClick} onRightClick={this.handleOnHeaderRightClick} />
          <Slogan title={slogan && slogan['title'] || ''} subTitle={slogan && slogan['desc'] || ''} />
          <HomeBg />
          <BorrowingLimitCard
            limitNumber={3000}
            leftNumber={1000}
            onGotoBorrowBtnPress={() => {
              toast('去借款吧')
              const { navigation } = this.props
              navigation && navigation.navigate('BorrowCenter')
            }}
          />
          <WaitingReturn
            dateStr={'2019年09月13日'}
            moneyNumber={30000}
            onItemPress={() => {
              toast('待还款')
            }}
          />
          <HomeBtn
            onUpgradeBtnPress={this.handleOnUpgradeBtnPress}
            onReturnBtnPress={this.handleOnReturnBtnPress}
            onAuthBtnPress={this.handleOnAuthBtnPress}
            onLoginBtnPress={this.handleOnLoginBtnPress}
            showStatus={this.state.showStatus}
          />
          <My
            show={this.state.showMy}
            showStatus={this.state.showStatus}
            order={this.state.borrowOrder}
            navigation={this.props.navigation}
            bank={this.state.bank}
            sc={this.state.service_contact}
            onClose={() => {
              this.setState({ showMy: false })
            }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: device.width,
    height: device.height,
    // backgroundColor: 'red'
  },
  scrollWraper: {
    width: device.width,
    height: device.height,
    backgroundColor: '#F7F7F7'
  }
})

// 侧边栏动画
const getPageAni = () => {
  let aniRight = true
  if (aniRight) {
    return {
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: (sceneProps: any) => {
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
      screenInterpolator: (sceneProps: any) => {
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


const MainStack = createStackNavigator(
  Object.assign({
    Home: {
      screen: HomeScreen,
    }
  }, routes),
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    transitionConfig: () => (getPageAni())
  }
)

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