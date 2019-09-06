import PubSub from "pubsub-js";
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import { p } from '../utils/p';
import { tm } from '../utils/theme';
const moment = require('moment');
moment.locale('zh-CN');



class Waiting extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '我的待还'
    }

  };

  componentWillReceiveProps(nextProps) {
    this.setState({ status: nextProps.navigation.state.params['statusName'] });
    this.setState({ money: nextProps.navigation.state.params['money'] || 1500 });
    switch (nextProps.navigation.state.params['statusName']) {
      case 'unfinished':
        this.setState({ statusName: '（未结清）' });
        break;
      case 'over':
        this.setState({ statusName: '（已逾期）' });
        break;
    }

    if (nextProps.navigation.state.params['backHome'] === true) {
      this.props.navigation.setParams({ reBack: () => { this.props.navigation.navigate('Home') }, backHome: false });
    }

  }

  constructor(props) {
    super(props);
    this.state = {
      status: '',
      statusName: '',
      money: 1500,
      disabledRed: false
    };
  }

  async goBorrow() {
    await this.setState({ disabledRed: true });
    this.props.navigation.push('BorrowCenter');
  }

  componentWillUnmount() {
    if (this.sub) {
      PubSub.unsubscribe(this.sub);
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });

    if (!this.sub) {
      this.sub = PubSub.subscribe('BACK_HOME', (msg, data) => {
        if (data === 'BorrowCenter') {
          this.setState({ disabledRed: false });
        }
      });
    }

  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <Image style={styles.icon} source={require('../images/icons/red/1.png')} />
        <View style={styles.textLine}>
          <Text style={styles.text}>您还没有待还订单哦，</Text>
          <TouchableOpacity disabled={this.state.disabledRed} onPress={() => { this.goBorrow() }}>
            <Text style={styles.clickText}>立即借款</Text>
          </TouchableOpacity>
        </View>

      </View>
    );



  }
}


const styles = StyleSheet.create({
  redColor: {
    color: '#E73939'
  },
  bottomBase: {
    width: p.td(750),
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(1),
    paddingTop: p.td(40),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btC: {
    lineHeight: p.td(40),
    position: 'absolute',
    textAlign: 'right',
    right: 0,
    bottom: 0,
    fontSize: p.td(28),
    color: '#4F5A6E'
  },
  btT: {
    lineHeight: p.td(40),
    position: 'absolute',
    textAlign: 'left',
    left: 0,
    bottom: 0,
    fontSize: p.td(28),
    color: '#737577'
  },
  btArea: {
    width: p.td(682),
    height: p.td(40),
    position: 'relative',
    marginBottom: p.td(32)
  },
  contractText: {
    color: tm.mainColor,
    fontSize: p.td(28),
    lineHeight: p.td(40),
  },
  contract: {
    position: 'absolute',
    textAlign: 'right',
    right: 0,
    bottom: p.td(32),
    height: p.td(40),
    width: p.td(750),
    alignItems: 'center',
  },
  overBottom: {
    height: p.td(558)
  },
  money: {
    top: p.td(110),
    textAlign: 'center',
    color: '#4F5A6E',
    fontSize: p.td(64),
    width: p.td(750),
    left: 0,
    position: 'absolute',
    lineHeight: p.td(90)
  },
  overColor: {
    color: '#E73939'
  },
  backBtn: {
    position: 'absolute',
    top: p.td(324),
    left: p.td(241),
  },
  backDate: {
    color: '#000',
    top: p.td(220),
    lineHeight: p.td(46),
    textAlign: 'center',
    position: 'absolute',
    fontSize: p.td(32),
    width: p.td(750),
    left: 0,
  },
  subTitle: {
    color: '#838B97',
    fontSize: p.td(32),
    width: p.td(750),
    left: 0,
    top: p.td(42),
    textAlign: 'center',
    position: 'absolute',
    lineHeight: p.td(46)
  },
  header: {
    width: p.td(750),
    height: p.td(308),
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(1),
    backgroundColor: '#fff'
  },
  headerBig: {
    height: p.td(474),
  },
  containerS: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },
  containerC: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },
  icon: {
    width: p.td(122),
    height: p.td(103),
    position: 'absolute',
    top: p.td(190),
    left: p.td(314)
  },
  text: {
    fontSize: p.td(30),
    color: '#3E475B',
    lineHeight: p.td(42),
  },
  textLine: {
    position: 'absolute',
    width: p.td(750),
    left: 0,
    top: p.td(440),

    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  clickText: {
    color: tm.mainColor,
    textDecorationLine: 'underline',
    fontSize: p.td(30),
    lineHeight: p.td(42),
  }
});
export default createStackNavigator({
  Waiting: {
    screen: Waiting
  }
}, {
  initialRouteName: 'Waiting',
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
