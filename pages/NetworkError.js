import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import AnalyticsUtil from '../umeng/AnalyticsUtil';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import DefaultPage from './common/DefaultPage';

const { icons } = tm


const icon = {
  red: require('../images/icons/red/cup.png'),
  blue: require('../images/icons/red/cup.png'),
  green: require('../images/icons/green/cup.png')
};


class NetworkError extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '网络错误'
    }
  };

  constructor(props) {
    super(props);
    AnalyticsUtil.onPageStart('网络错误');
    this.state = {
      params: null
    }
  }

  async componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
  }

  componentWillUnmount() {
    AnalyticsUtil.onPageEnd('网络错误');
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps.navigation.state.params------->', nextProps.navigation.state.params);
    if (nextProps.navigation.state.params['fuck']) {
      this.setState({ params: nextProps.navigation.state.params['fuck'] });
    }
  }

  render() {
    return (
      <DefaultPage
        iconSource={icons.defaultPage.netError}
        onBack={() => {
          this.props.navigation.pop()
        }}
        message={'网络不可用，请稍后再试，'}
        actionName={'重新加载'}
      />
    )


    /*
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={icon[p.tn]}/>
        <Text style={styles.text}>网络不给力，请稍后再试</Text>
        <Text style={styles.textErrorInfo} selectable>{JSON.stringify(this.state.params)} </Text>
      </View>
    );
    */
  }
}


const styles = StyleSheet.create({
  textErrorInfo: {
    width: p.td(750),
    // height: p.td(42),
    color: '#3E475B',
    fontSize: p.td(20),
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    top: p.td(310),
    lineHeight: 22
  },
  text: {
    width: p.td(750),
    height: p.td(42),
    color: '#3E475B',
    fontSize: p.td(30),
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    top: p.td(260),
  },
  icon: {
    width: p.td(120),
    height: p.td(97),
    left: p.td(315),
    top: p.td(100),
    position: 'absolute'
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },

});
export default createStackNavigator({
  NetworkError: {
    screen: NetworkError
  }
}, {
  initialRouteName: 'NetworkError',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomColor: '#fff',
      elevation: 0,
      ...Platform.select({
        android: {
          // height: 56 + StatusBar.currentHeight,
          // paddingTop: StatusBar.currentHeight
        }
      }),
    },
    headerTitleStyle: {
      fontSize: p.td(36),
      color: '#4F5A6E'
    }
  }
});
