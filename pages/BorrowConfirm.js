import PubSub from "pubsub-js";
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import api from '../utils/api';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
const accounting = require('accounting');

class BorrowConfirm extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '借款确认'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      feeRate: 0,
      dayLength: 0,
      bankName: 'xxxx',
      cardLast: '9999',
      showLoading: true,
      disabledNext: false,
      contractName: null
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.navigation.state.params['r']) return;
    const params = nextProps.navigation.state.params['r'];
    this.setState({ value: params['value'], feeRate: params['feeRate'], dayLength: params['dayLength'] });
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      reBack: () => {
        this.props.navigation.pop();
        PubSub.publish('BACK_BORROW_CENTER', 'BorrowConfirm');
      }
    });
    this.setState({ showLoading: true });
    const resp = await api.get('/borrow/bank/info');
    if (resp['success'] === true) {
      this.setState({ bankName: resp['bankName'], cardLast: resp['cardLast'], contractName: resp['contract']['name'] });
    }
    this.setState({ showLoading: false });
    console.log(resp);
  }
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.card}>
          <View style={styles.themeBar} />
          <Text style={styles.title}>借款金额</Text>
          <View style={styles.moneyLine}>
            <Text style={styles.money}>{this.state.value}</Text>
            <Text style={styles.priceTag}>¥</Text>
          </View>

          <Text style={[styles.nt, styles.nt1]}>到账金额：{accounting.formatNumber(this.state.value * (1 - this.state.feeRate), 2, '')}元</Text>
          <Text style={[styles.nt, styles.nt2]}>综合费用：{accounting.formatNumber(this.state.value * this.state.feeRate, 2, '')}元</Text>
          <Text style={[styles.nt, styles.nt3]}>还款金额：{accounting.formatNumber(this.state.value, 2, '')}元</Text>
          <Text style={[styles.nt, styles.nt4]}>借款期限：{this.state.dayLength}天</Text>
          <Text style={[styles.nt, styles.nt5]}>收款账户：{this.state.bankName}（{this.state.cardLast}）</Text>

          <RedBtn disabled={this.state.disabledNext} style={styles.goNextSure} title='确认' show={true} onPress={() => { this.goNext() }} />


          <View style={styles.textLine}>
            <Text style={styles.textHo}>确认即表示同意《</Text>
            <TouchableOpacity onPress={() => { this.showContract() }}><Text style={styles.clickText}>{this.state.contractName}</Text></TouchableOpacity>
            <Text style={styles.textHo}>》</Text>
          </View>

          <Text style={styles.notice}>提醒：确认后不可取消该借款。为了您能积累良好的信用记录，请提前做好资金安排，以免逾期产生的不良后果。</Text>
        </View>
        <Loading show={this.state.showLoading} />
      </View>
    );
  }


  async goNext() {
    await this.setState({ disabledNext: true, showLoading: true });
    const resp = await api.post('/borrow/order', { value: this.state.value, dayLength: this.state.dayLength });
    this.setState({ showLoading: false });
    console.log('!!!! => ', resp);
    if (resp && resp['success'] === true) {
      Toast('借款申请提交成功');
      this.props.navigation.push('BorrowDetail', {
        statusName: 'normal',
        orderId: resp['orderId'],
        backHome: true
      });
    } else {
      switch (resp['code']) {
        case 7001:
          PubSub.publish('BACK_HOME', 'BorrowConfirm');
          this.props.navigation.navigate({ routeName: 'Home', params: { statusName: 'borrow', params: false } });
          break;
        case 50002:
          this.props.navigation.navigate({ routeName: 'AuthenticationCenter' });
          break;
        default:
          if (!resp['msg'] instanceof Array) {
            Toast('借款申请提交失败');
          }
      }

      await this.setState({ disabledNext: false });
    }

  }

  showContract() {
    this.props.navigation.navigate({
      routeName: 'PWViewer',
      params: {
        r: {
          name: 'BorrowContract',
          type: 'pre_contract',
          value: this.state.value,
          dayLength: this.state.dayLength
        }
      }
    });
  }
}


const styles = StyleSheet.create({
  notice: {
    lineHeight: p.td(40),
    color: '#888',
    fontSize: p.td(30),
    position: 'absolute',
    width: p.td(606),
    bottom: p.td(42),
    left: p.td(39)
  },
  textHo: {
    fontSize: p.td(30),
    color: '#4F5A6E',
    lineHeight: p.td(42),
  },
  textLine: {
    position: 'absolute',
    width: p.td(684),
    left: 0,
    top: p.td(838),
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
  goNextSure: {
    position: 'absolute',
    width: p.td(300),
    left: p.td(192),
    top: p.td(680)
  },
  nt1: {
    top: p.td(306)
  },
  nt2: {
    top: p.td(378)
  },
  nt3: {
    top: p.td(450)
  },
  nt4: {
    top: p.td(522)
  },
  nt5: {
    top: p.td(594)
  },
  nt: {
    position: 'absolute',
    left: p.td(184),
    color: '#4F5A6E',
    fontSize: p.td(30),
    lineHeight: p.td(42)
  },
  priceTag: {
    position: 'absolute',
    left: p.td(-20),
    fontSize: p.td(30),
    bottom: p.td(10),
    lineHeight: p.td(36),
    fontFamily: 'HelveticaNeue',
  },
  money: {
    fontSize: p.td(64),
    color: '#000',
    lineHeight: p.td(80),
    fontFamily: 'HelveticaNeue-Medium',
  },
  moneyLine: {
    position: 'relative',
    marginTop: p.td(172)
  },
  title: {
    position: 'absolute',
    top: p.td(102),
    left: 0,
    width: p.td(684),
    lineHeight: p.td(48),
    fontSize: p.td(32),
    color: '#646464',
    textAlign: 'center'
  },
  themeBar: {
    height: p.td(18),
    width: p.td(684),

    backgroundColor: tm.mainColor,
    position: 'absolute',
    top: 0,
    left: 0
  },
  card: {
    width: p.td(684),
    height: p.td(1120),
    marginTop: p.td(38),
    backgroundColor: '#fff',
    borderRadius: p.td(24),
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },

});
export default createStackNavigator({
  BorrowConfirm: {
    screen: BorrowConfirm
  }
}, {
  initialRouteName: 'BorrowConfirm',
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
