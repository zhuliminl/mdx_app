import * as React from 'react';
import { View, ScrollView, StyleSheet, Text, Animated, Easing } from 'react-native';
import { device } from '@/utils/device'
import SplashScreen from 'react-native-splash-screen';
import HomeHeader from './home-header'
import HomeBg from './home-bg'
import Slogan from './slogan'
import BorrowingLimitCard from './borrowing-limit-card'
import WaitingReturn from './waiting-return'
import HomeBtn from './home-btn'
import { routes } from '../../Routes'
import { NavigationScreenProp, NavigationNavigatorProps, NavigationTransitionProps, createStackNavigator } from 'react-navigation'
import UpdateModalScreen from '../update/UpdateModal';
import My from '../My'

export interface HomeProps extends NavigationTransitionProps {
}

export interface HomeState {
}

class HomeScreen extends React.Component<HomeProps, HomeState> {
  state = {
    showMy: false,
  }

  componentDidMount = () => {
    SplashScreen.hide()
  }

  handleOnHeaderLeftClick = () => {
    // 如果没有登录，则跳转登录
    this.setState({ showMy: true });
  }

  handleOnHeaderRightClick = () => {
    const { navigation } = this.props
    // 如果没有登录，则跳转登录，否则跳转信息
    const logined = true
    if (logined) {
      return navigation && navigation.push('Messages')
    }
  }

  public render() {
    return (
      <View
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollWraper}
          alwaysBounceVertical={!this.state.showMy === true}
        >
          <HomeHeader
            onLeftClick={this.handleOnHeaderLeftClick}
            onRightClick={this.handleOnHeaderRightClick}
          />
          <Slogan
            title={'在你需要的时候，有我'}
            subTitle={'赤兔贷 极速放贷 轻松还款'}
          />
          <HomeBg />
          <BorrowingLimitCard />
          <WaitingReturn />
          <HomeBtn />
          <My
            show={this.state.showMy}
            // showStatus={this.state.showStatus}
            // order={this.state.borrowOrder}
            navigation={this.props.navigation}
            // bank={this.state.bank}
            // sc={this.state.service_contact}
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