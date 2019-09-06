import PubSub from "pubsub-js";
import React from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import api from '../utils/api';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
const accounting = require('accounting');
const moment = require('moment');
moment.locale('zh-CN');

const { icons } = tm

class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={[styles.item, this.props.status === 'over' ? { backgroundColor: 'rgba(199,55,55, 0.2)' } : {}]}
        onPress={() => {
          this.props.navigation.push('BorrowDetail', {
            statusName: (this.props.status || 'normal'),
            orderId: this.props.order['out_id'],
            backHome: false
          })
        }}>
        <Text style={styles.money}>
          {accounting.formatNumber(this.props.money, 2, '')}
        </Text>
        <Text style={styles.date}>
          {moment(this.props.order.created_at).format('YYYY年MM月DD日')}
        </Text>

        {this.end()}
      </TouchableOpacity>
    );
  }

  end() {
    switch (this.props.status) {
      case 'refused':
        return (
          <View style={styles.end}>
            <Text style={[styles.endT]}>已拒绝</Text>
            <Image style={[styles.endI]} source={require('../images/icons/arrow-dblue.png')} />
          </View>
        );

      case 'finished':
        return (
          <View style={styles.end}>
            <Text style={[styles.endT]}>已完结</Text>
            <Image style={[styles.endI]} source={require('../images/icons/arrow-dblue.png')} />
          </View>
        );
      case 'banking':
        return (
          <View style={styles.end}>
            <Text style={[styles.endT]}>正在放款</Text>
            <Image style={[styles.endI]} source={require('../images/icons/arrow-dblue.png')} />
          </View>
        );
      case 'success':
        return (
          <View style={styles.end}>
            <Text style={[styles.endT, styles.endTNormal]}>待还款</Text>
            <Text style={[styles.dateEnd]}>{moment(this.props.order.ok_at).add(this.props.order.day_length - 1, 'days').format('YYYY年MM月DD日')}</Text>
            <Image style={[styles.endI]} source={require('../images/icons/arrow-dblue.png')} />
          </View>
        );
      case 'over':
        return (
          <View style={styles.end}>
            <Text style={[styles.endT, styles.endTNormal, styles.endTOver]}>待还款(已逾期)</Text>
            <Text style={[styles.dateEnd]}>{moment(this.props.order.ok_at).add(this.props.order.day_length - 1, 'days').format('YYYY年MM月DD日')}</Text>
            <Image style={[styles.endI]} source={require('../images/icons/arrow-dblue.png')} />
          </View>
        );
      default:
        return (
          <View style={styles.end}>
            <Text style={[styles.endT, styles.ing]}>审核中</Text>
            <Image style={[styles.endI]} source={require('../images/icons/arrow-dblue.png')} />
          </View>
        );
    }
  }
}

class BorrowRecords extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '我的借款单'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      disabledRed: false
    };
  }

  componentWillUnmount() {
    if (this.sub) {
      PubSub.unsubscribe(this.sub);
    }
  }


  async componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
    const resp = await api.get('/users/orders');
    this.setState({ orders: resp['orders'] });

    if (!this.sub) {
      this.sub = PubSub.subscribe('BACK_HOME', (msg, data) => {
        if (data === 'BorrowCenter') {
          this.setState({ disabledRed: false });
        }
      });
    }
  }

  getOrders() {
    const orders = [];
    for (let order of this.state.orders) {
      switch (order.status) {
        case 0:
          orders.push(<Item key={order.id} order={order} money={order.money / 100} navigation={this.props.navigation} />);
          break;
        case 1:
          orders.push(<Item key={order.id} order={order} status='banking' money={order.money / 100} navigation={this.props.navigation} />);
          break;
        case 2:
          const endDate = moment(moment(order.ok_at).add(order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00')).unix();
          const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
          if (endDate < nowDate) {
            orders.push(<Item key={order.id} order={order} status='over' money={order.money / 100} navigation={this.props.navigation} />);
            break;
          }
          orders.push(<Item key={order.id} order={order} status='success' money={order.money / 100} navigation={this.props.navigation} />);
          break;
        case 4:
          orders.push(<Item key={order.id} order={order} status='finished' money={order.money / 100} navigation={this.props.navigation} />);
          break;
        case 11:
          orders.push(<Item key={order.id} order={order} status='refused' money={order.money / 100} navigation={this.props.navigation} />);
          break;
      }
    }

    return orders;
  }
  render() {
    if (this.state.orders && this.state.orders.length > 0) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.containerC}>
          <StatusBar hidden={false} barStyle="dark-content" />
          {this.getOrders()}
          {/*<Item money={2000} navigation={this.props.navigation}/>*/}
          {/*<Item money={2000} status='success' navigation={this.props.navigation}/>*/}
          {/*<Item money={2000} status='over' navigation={this.props.navigation}/>*/}
          {/*<Item money={2000} status='refused' navigation={this.props.navigation}/>*/}
          {/*<Item money={2000} status='finished' navigation={this.props.navigation}/>*/}

        </ScrollView>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <Image style={styles.icon} source={icons.defaultPage.orderBlank} />
        <View style={styles.textLine}>
          <Text style={styles.text}>您还没有待还订单哦，</Text>
          <TouchableOpacity disabled={this.state.disabledRed} onPress={() => { this.goBorrow() }}>
            <Text style={styles.clickText}>立即借款</Text>
          </TouchableOpacity>
        </View>

      </View>
    );


  }



  async goBorrow() {
    await this.setState({ disabledRed: true });
    this.props.navigation.push('BorrowCenter');
  }

}


const styles = StyleSheet.create({
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
  },
  ing: {
    color: '#737577'
  },
  endTOver: {
  },
  dateEnd: {
    color: '#4F5A6E',
    fontSize: p.td(28),
  },
  endTNormal: {
    color: tm.mainColor
  },
  date: {
    fontSize: p.td(28),
    lineHeight: p.td(48),
    position: 'absolute',
    left: p.td(30),
    color: '#4F5A6E',
    bottom: p.td(12),
  },
  money: {
    fontSize: p.td(34),
    lineHeight: p.td(48),
    position: 'absolute',
    left: p.td(30),
    color: '#000',
    top: p.td(18),
  },
  endI: {
    position: 'absolute',
    right: p.td(30),
    width: p.td(16),
    height: p.td(26)
  },
  endT: {
    textAlign: 'right',
    fontSize: p.td(28),
    lineHeight: p.td(48),
    color: '#4F5A6E'
  },
  end: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: p.td(119),
    paddingRight: p.td(56),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  item: {
    height: p.td(120),
    width: p.td(750),
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff'
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },
  containerC: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }

});
export default createStackNavigator({
  BorrowRecords: {
    screen: BorrowRecords
  }
}, {
  initialRouteName: 'BorrowRecords',
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
