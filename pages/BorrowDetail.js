import PubSub from "pubsub-js";
import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import BackFailed from "../cpns/BackFailed";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import api from '../utils/api';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
const accounting = require('accounting');
const moment = require('moment');
const _ = require('lodash');
moment.locale('zh-CN');

class BorrowDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: navigation.getParam('title', '借款详情')
    }
  };

  async checkOver(order) {
    if (!(order && order.ok_at)) return;
    const endDate = moment(moment(order.ok_at).add(order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00'));
    const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
    if (endDate.unix() < nowDate.unix()) {
      await this.setState({ isOver: true });
    }
  }

  async doOver(resp) {

    const endDate = moment(moment(this.state.order.ok_at).add(this.state.order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00')).unix();
    const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    const overDays = (nowDate - endDate) / 86400;
    const dayMoney = this.state.money * resp['over_fee']['day_rate'];
    const maxMoney = this.state.money * resp['over_fee']['max_rate'];
    let overFee = overDays * dayMoney;
    if (maxMoney < overFee) {
      overFee = maxMoney;
    }

    await this.setState({ statusName: '待还款，订单已逾期', status: 'over', overFee });
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params['reload'] !== false) {
      this.setState({
        status: nextProps.navigation.state.params['statusName'],
        money: nextProps.navigation.state.params['money']
      });
      const orderId = nextProps.navigation.state.params['orderId'];

      this.setState({ showLoading: true });
      const resp = await api.get(`/borrow/order/${orderId}`);
      this.setState({ showLoading: false });

      if (orderId && resp['success'] === true) {
        console.log('resp', resp, nextProps.navigation.state.params['statusName']);
        await this.setState({
          order: resp['order'],
          money: resp['order']['money'] / 100,
          feeMoney: resp['order']['fee_money'] / 100,
          backMoney: (resp['order']['back_money'] || 0) / 100,
          dayLength: resp['order']['day_length'],
          bankName: resp['order']['bank_name'],
          bankLast: _.takeRight(resp['order']['card'], 4).join('')
        });

        await this.checkOver(resp['order']);
      }

      switch (nextProps.navigation.state.params['statusName']) {
        case 'refused':
          await this.setState({ statusName: '已拒绝' });
          break;
        case 'banking':
          await this.setState({ statusName: '放款中' });

          break;
        case 'finished':
          await this.setState({ statusName: '已完结' });
          break;
        case 'success':
          await this.setState({ statusName: '待还款' });
          console.log('this.state.isOver', this.state.isOver);
          if (this.state.isOver === true) {
            await this.doOver(resp);
          }
          break;
        case 'over':
          await this.doOver(resp);

          break;
        case 'normal':
          await this.setState({ statusName: '审核中' });

          break;
      }

      this.props.navigation.setParams({
        reBack: () => {
          this.props.navigation.navigate('Home');
          PubSub.publish('BACK_HOME', 'BorrowDetail');
        },
        reload: false,
        backHome: false,
        //title: '我的待还'
      });

    }

  }

  bigHeader() {
    switch (this.state.status) {
      case 'success':
        return styles.headerBig;
      case 'over':
        return styles.headerBig;
      default:
        return {}
    }
  }

  showBack() {
    console.log('this.state.order.is_backing ---------------> ', this.state.order.is_backing);
    let back = <RedBtn show={true} title='还款'
      onPress={async () => {
        const resp = await api.get(`/borrow/is_offline/${this.state.order.id}`);
        if (resp['success'] === true) {
          this.props.navigation.push('Back', { order: this.state.order });
        } else if (resp['code'] === 35001) {
          this.setState({ showBackFailed: true });
        }

      }}
      style={[styles.backBtn, { width: p.td(268) }]} />;


    if (this.state.order.is_backing === 1 || this.state.order.is_backing === true) {
      back = <RedBtn show={true} title='还款'
        onPress={() => { this.props.navigation.push('BackSuccess', { order: this.state.order }) }}
        style={[styles.backBtn, { width: p.td(268) }]} />;
    }

    switch (this.state.status) {
      case 'success':
        return back;
      case 'over':
        return back;
      default:
        return null
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      status: '',
      statusName: '',
      money: 0,
      feeMoney: 0,
      dayLength: 0,
      bankName: null,
      bankLast: null,
      showLoading: false,
      isOver: false,
      order: {},
      overFee: 0,
      showBackFailed: false
    };
  }



  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.containerC}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <View style={[styles.header, this.bigHeader()]}>

          <Text style={[styles.subTitle, this.state.status === 'over' ? styles.overColor : {}]}>借款金额(元)</Text>
          <Text style={[styles.money, this.state.status === 'over' ? styles.overColor : {}]}>{this.state.money}</Text>
          <Text style={[styles.status, this.state.status === 'over' ? [styles.overColor] : {}]}>{this.state.statusName}</Text>
          {this.showBack()}
        </View>
        {this.getBottom()}

        <BackFailed title={'提示'} content={'您已线下还款，如需继续还款请联系客服。'} show={this.state.showBackFailed === true} doHide={() => { this.setState({ showBackFailed: false }) }} />

        <Loading show={this.state.showLoading} />
      </ScrollView>
    );
  }

  getNormalBanking() {
    return <View style={[styles.bottomBase, styles.normalBottom]}>
      <View style={styles.btArea}>
        <Text style={styles.btT}>借款金额</Text>
        <Text style={styles.btC}>{accounting.formatNumber(this.state.money, 2, ',')}元</Text>
      </View>

      <View style={styles.btArea}>
        <Text style={styles.btT}>综合费用</Text>
        <Text style={styles.btC}>{accounting.formatNumber(this.state.feeMoney, 2, ',')}元</Text>
      </View>

      <View style={styles.btArea}>
        <Text style={styles.btT}>借款期限</Text>
        <Text style={styles.btC}>{this.state.dayLength}天</Text>
      </View>

      <View style={styles.btArea}>
        <Text style={styles.btT}>收款账户</Text>
        <Text style={styles.btC}>{this.state.bankName}（{this.state.bankLast}）</Text>
      </View>
    </View>;
  }

  getContract() {
    return (
      <TouchableOpacity style={styles.contract} onPress={() => { this.goExistContract() }}>
        <Text style={styles.contractText}>查看合同及协议</Text>
      </TouchableOpacity>
    );
  }

  getBottom() {
    switch (this.state.status) {
      case 'success':
        return (
          <View style={[styles.bottomBase, styles.successBottom]}>
            <View style={styles.btArea}>
              <Text style={styles.btT}>借款金额</Text>
              <Text style={styles.btC}>{accounting.formatNumber(this.state.money, 2, ',')}元</Text>
            </View>
            <View style={styles.btArea}>
              <Text style={styles.btT}>还款金额</Text>
              <Text style={styles.btC}>{accounting.formatNumber(this.state.money, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>综合费用</Text>
              <Text style={styles.btC}>{accounting.formatNumber(this.state.feeMoney, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>借款期限</Text>
              <Text style={styles.btC}>7天</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>还款账户</Text>
              <Text style={styles.btC}>{this.state.order.bank_name}（{this.state.bankLast}）</Text>
            </View>
            {this.getContract()}
          </View>
        );
      case 'over':
        return (
          <View style={[styles.bottomBase, styles.overBottom]}>
            <View style={styles.btArea}>
              <Text style={[styles.btT, styles.redColor]}>还款总金额</Text>
              <Text style={[styles.btC, styles.redColor]}>{accounting.formatNumber(this.state.money + this.state.overFee, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT, styles.redColor]}>剩余还款</Text>
              <Text style={[styles.btC, styles.redColor]}>{accounting.formatNumber(this.state.money + this.state.overFee - (this.state.order.back_money ? (this.state.order.back_money / 100) : 0), 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT, styles.redColor]}>借款金额</Text>
              <Text style={[styles.btC, styles.redColor]}>{accounting.formatNumber(this.state.money, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT, styles.redColor]}>已还金额</Text>
              <Text style={[styles.btC, styles.redColor]}>{accounting.formatNumber(this.state.order.back_money ? (this.state.order.back_money / 100) : 0, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT, styles.redColor]}>综合费用</Text>
              <Text style={[styles.btC, styles.redColor]}>{accounting.formatNumber(this.state.feeMoney, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT, styles.redColor, styles.redBold]}>滞纳金</Text>
              <Text style={[styles.btC, styles.redColor, styles.redBold]}>{accounting.formatNumber(this.state.overFee, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>借款期限</Text>
              <Text style={styles.btC}>{this.state.order.day_length}天</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>收款账户</Text>
              <Text style={styles.btC}>{this.state.order.bank_name}（{this.state.bankLast}）</Text>
            </View>
            {this.getContract()}
          </View>
        );
      case 'finished':
        return (
          <View style={[styles.bottomBase, styles.finishedBottom]}>


            <View style={styles.btArea}>
              <Text style={[styles.btT]}>借款金额</Text>
              <Text style={[styles.btC]}>{accounting.formatNumber(this.state.money, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT]}>还款金额</Text>
              <Text style={[styles.btC]}>{accounting.formatNumber(this.state.backMoney, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT]}>综合费用</Text>
              <Text style={[styles.btC]}>{accounting.formatNumber(this.state.feeMoney, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={[styles.btT]}>滞纳金</Text>
              <Text style={[styles.btC]}>{accounting.formatNumber(this.state.backMoney - this.state.money, 2, ',')}元</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>借款期限</Text>
              <Text style={styles.btC}>{this.state.order.day_length}天</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>应还时间</Text>
              <Text style={styles.btC}>{moment(this.state.order.ok_at).add(this.state.order.day_length - 1, 'days').format('YYYY年MM月DD日')}</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>还款时间</Text>
              <Text style={styles.btC}>{moment(this.state.order.back_at).format('YYYY年MM月DD日')}</Text>
            </View>

            <View style={styles.btArea}>
              <Text style={styles.btT}>收款账户</Text>
              <Text style={styles.btC}>{this.state.order.bank_name}（{this.state.bankLast}）</Text>
            </View>
            {this.getContract()}
          </View>
        );
      case 'refused':
        return (
          <View style={styles.refusedBottom}>
            <Text style={styles.refusedBottomText}>很遗憾！您的借款申请未通过审核</Text>
          </View>
        );
      case 'normal':
        return this.getNormalBanking();
      case 'banking':
        return this.getNormalBanking();
      default:
        return null;
    }
  }

  goExistContract() {
    this.props.navigation.navigate({ routeName: 'PWViewer', params: { r: { name: 'BorrowContract', type: 'exist_contract', orderId: this.state.order.id } } });
  }
}


const styles = StyleSheet.create({
  finishedBottom: {
    height: p.td(708)
  },
  redBold: {
  },
  redColor: {
    color: '#E73939'
  },
  overBottom: {
    height: p.td(728)
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
  successBottom: {
    height: p.td(504)
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
  normalBottom: {
    height: p.td(346)
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
  refusedBottomText: {
    color: '#4F5A6E',
    fontSize: p.td(30),
    width: p.td(750),
    left: 0,
    top: p.td(136),
    textAlign: 'center',
    position: 'absolute',
    lineHeight: p.td(46)
  },
  refusedBottom: {
    position: 'absolute',
    left: 0,
    top: p.td(310),
    width: p.td(750),
    bottom: 0,
    backgroundColor: '#fff'
  },
  overColor: {
    color: '#E73939'
  },
  backBtn: {
    position: 'absolute',
    top: p.td(324),
    left: p.td(241),
  },
  status: {
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
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },
  containerC: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});
export default createStackNavigator({
  BorrowDetail: {
    screen: BorrowDetail
  }
}, {
  initialRouteName: 'BorrowDetail',
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
