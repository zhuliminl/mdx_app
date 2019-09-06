import React from 'react';
import { AsyncStorage, Clipboard, Image, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { banksIcon } from '../utils/banksIcon';
import { p } from '../utils/p';
import { statusToName } from '../utils/statusToName';
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
const moment = require('moment');


const { icons } = tm;

export default class My extends React.Component {
  constructor(props) {
    super(props);

    Animatable.initializeRegistryWithDefinitions({
      show: {
        from: {
          opacity: 0,
          transform: [
            { translateX: - p.td(570) }
          ]
        },
        to: {
          opacity: 1,
          transform: [
            { translateX: 0 }
          ]
        },
      },
      hide: {
        from: {
          opacity: 1,
          transform: [
            { translateX: 0 }
          ]
        },
        to: {
          opacity: 0,
          transform: [
            { translateX: - p.td(570) }
          ]
        },
      }
    });

    this.state = {
      aName: '',
      show: null,
      mobile: null,
      bank: null,
      sc: {}
    };

  }

  async componentWillReceiveProps(nextProps) {
    switch (nextProps['show']) {
      case null:
        this.setState({ aName: '', show: null });
        break;
      case true:
        this.setState({ aName: 'show', show: true });
        break;
      case false:
        this.setState({ aName: 'hide', show: false });
        break;
    }

    if (nextProps.hasOwnProperty('bank')) {
      this.setState({ bank: nextProps.bank })
    }

    if (nextProps.hasOwnProperty('sc') && nextProps['sc']) {
      this.setState({ sc: nextProps['sc'], mobile: await AsyncStorage.getItem('mobile') });
    }
  }

  close() {
    this.setState({ aName: 'hide' });
    setTimeout(() => {
      this.props['onClose']();
    }, 350)
  }

  getWaiting() {
    const waiting = [];
    if (!(this.props.order && this.props.order.status === 2)) return null;

    const endDate = moment(moment(this.props.order.ok_at).add(this.props.order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00'));
    const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
    let isOver = false;
    if (endDate.unix() < nowDate.unix()) {
      isOver = true;
    }

    waiting.push(
      <Text key={1} style={[styles.date, isOver === false ? { color: '#4F5A6E', lineHeight: p.td(56) } : {}]}>
        还款日:{moment(this.props.order['ok_at']).add(this.props.order['day_length'] - 1, 'days').format('YYYY年MM月DD日')}
      </Text>
    );
    if (endDate.unix() < nowDate.unix()) {
      waiting.push(<Text key={2} style={styles.status}>已逾期</Text>);
    }
    return waiting;
  }

  goWaiting() {
    switch (this.props.showStatus) {
      case 0:
        return Toast('请先登录');
      case 1:
        return Toast('请先激活');
    }

    if (!(this.props.order && this.props.order.status === 2)) return this.props.navigation.push('Waiting');
    this.props.navigation.push('BorrowDetail', {
      statusName: statusToName(this.props.order.status),
      orderId: this.props.order['out_id'],
      title: '我的待还',
      backHome: true
    });
  }

  goBorrowRecords() {
    switch (this.props.showStatus) {
      case 0:
        return Toast('请先登录');
      case 1:
        return Toast('请先激活');
    }
    this.props.navigation.push('BorrowRecords')
  }


  goUpgrade() {
    switch (this.props.showStatus) {
      case 0:
        return Toast('请先登录');
      case 1:
        return Toast('请先激活');
    }
    this.props.navigation.push('Upgrade');
  }


  getBank() {
    const bankShow = [];
    if (this.state.bank) {
      bankShow.push(<Image key={11} style={styles.bankLogo} source={banksIcon[this.state.bank.bankCode]} />);
      bankShow.push(<Text key={22} style={styles.bankLastNumber}>(尾号{this.state.bank.cardEnd})</Text>);

      return bankShow;
    }
    return null;

  }

  getWechat() {
    if (this.state.sc.wechat) {
      return (
        <TouchableOpacity style={[styles.listItem, styles.bLi]} onPress={() => {
          Clipboard.setString(this.state.sc.wechat);
          Toast('微信复制成功')
        }}>
          <Image style={[styles.lIcon, styles.bi]} source={require('../images/icons/wechat.png')} />
          <View style={[styles.lIC, styles.bl]}>
            <Text style={[styles.lICT, styles.bLICT]}>{this.state.sc.wechat}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  }

  getQQ() {
    if (this.state.sc.qq) {
      return (
        <TouchableOpacity style={[styles.listItem, styles.bLi]} onPress={() => {
          Clipboard.setString(this.state.sc.qq);
          Toast('QQ复制成功')
        }}>
          <Image style={[styles.lIcon, styles.bi]} source={require('../images/icons/qq.png')} />
          <View style={[styles.lIC, styles.bl]}>
            <Text style={[styles.lICT, styles.bLICT]}>{this.state.sc.qq}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    if (this.state.show === true) {
      return (
        <View style={[styles.container, this.props['style']]}>
          <StatusBar hidden={true} />
          <Animatable.View duration={300} animation={this.state.aName} style={styles.myBar}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.avatarOuter} onPress={() => { this.props.navigation.push('MyCenter') }}>
                <Image style={styles.avatar} source={require('../images/icons/avatar.png')} />
              </TouchableOpacity>
              <Text style={styles.account}>账户</Text>
              <Text style={styles.mobile}>{this.state.mobile ? this.state.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : null}</Text>
            </View>

            <View style={styles.list}>
              <TouchableOpacity onPress={() => {
                this.goWaiting();
              }} style={styles.listItem}>
                <Image
                  style={styles.lIcon}
                  source={icons.sideBar.waiting} />
                <View style={styles.lIC}>
                  <Text style={styles.lICT}>我的待还</Text>
                  {this.getWaiting()}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listItem}>
                <Image
                  style={[styles.lIcon, styles.lIconCard]}
                  source={icons.sideBar.card} />
                <View style={styles.lIC}>
                  <Text style={styles.lICT}>我的银行卡</Text>
                  {this.getBank()}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listItem} onPress={() => { this.goBorrowRecords() }}>
                <Image
                  style={[styles.lIcon, styles.lIconBorrowOrder]}
                  source={icons.sideBar.borrowOrder} />
                <View style={styles.lIC}>
                  <Text style={styles.lICT}>我的借款单</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listItem} onPress={() => { this.goUpgrade() }}>
                <Image
                  style={[styles.lIcon, styles.lIconUpgrade]}
                  source={icons.sideBar.upgrade} />
                <View style={styles.lIC}>
                  <Text style={styles.lICT}>我要提额</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listItem} onPress={() => { this.props.navigation.push('Feedback') }}>
                <Image
                  style={[styles.lIcon, styles.lIconFeedback]}
                  source={icons.sideBar.feedback} />
                <View style={styles.lIC}>
                  <Text style={styles.lICT}>意见反馈</Text>
                </View>
              </TouchableOpacity>

            </View>

            <View style={styles.bottomBar}>
              <TouchableOpacity style={[styles.listItem, styles.bLi]} onPress={() => {
                Linking.openURL(`tel:${this.state.sc.tel}`)
              }}>
                <Image style={[styles.lIcon, styles.bi]} source={require('../images/icons/mobile.png')} />
                <View style={[styles.lIC, styles.bl]}>
                  <Text style={[styles.lICT, styles.bLICT]}>{this.state.sc.tel}</Text>
                </View>
              </TouchableOpacity>

              {this.getQQ()}

              {this.getWechat()}
            </View>
          </Animatable.View>

          <TouchableOpacity style={styles.clickArea} onPress={this.close.bind(this)} />
        </View>
      );
    } else {
      return null;
    }

  }
}

const styles = StyleSheet.create({
  lIconFeedback: {
    width: p.td(27),
    height: p.td(36),
    left: p.td(2),
    top: p.td(28)
  },
  lIconUpgrade: {
    width: p.td(34),
    height: p.td(32),
    left: 0
  },
  lIconBorrowOrder: {
    left: 0,
  },
  lIconCard: {
    width: p.td(33),
    height: p.td(24),
    left: 0,
    top: p.td(36)
  },
  date: {
    fontSize: p.td(24),
    lineHeight: p.td(26),
    color: tm.mainColor,
  },
  status: {
    fontSize: p.td(30),
    lineHeight: p.td(80),
    color: '#E73939'
  },
  lICT: {
    lineHeight: p.td(94),
    color: '#4F5A6E',
    fontSize: p.td(34)
  },
  bLICT: {
    fontSize: p.td(26)
  },
  lIC: {
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    width: p.td(456)
  },
  bankLogo: {
    position: 'absolute',
    width: p.td(36),
    height: p.td(36),
    right: p.td(148),
    top: p.td(29)
  },
  bankLastNumber: {
    position: 'absolute',
    lineHeight: p.td(36),
    fontSize: p.td(24),
    color: '#4F5A6E',
    textAlign: 'right',
    right: p.td(20),
    top: p.td(30),
  },
  bl: {
    borderBottomWidth: 0,
  },
  listItem: {
    position: 'relative',
    paddingLeft: p.td(56)
  },
  bLi: {
    paddingLeft: p.td(66)
  },
  lIcon: {
    position: 'absolute',
    left: p.td(2),
    width: p.td(32),
    height: p.td(32),
    top: p.td(32)
  },
  bi: {
    top: p.td(24),
    width: p.td(46),
    height: p.td(46),
  },
  bottomBar: {
    backgroundColor: '#f9f9fc',
    width: p.td(570),
    height: p.td(322),
    position: 'absolute',
    left: 0,
    paddingLeft: p.td(46),
    bottom: 0,
    paddingTop: p.td(16)
  },
  list: {
    position: 'absolute',
    left: p.td(58),
    bottom: p.td(322),
    top: p.td(302),
    overflow: 'hidden',
    width: p.td(512),
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: p.td(46)
  },
  avatarOuter: {
    width: p.td(96),
    height: p.td(96),
    position: 'absolute',
    bottom: p.td(68),
    right: p.td(30)
  },
  avatar: {
    width: p.td(96),
    height: p.td(96),

  },
  account: {
    lineHeight: p.td(50),
    width: p.td(380),
    color: '#fff',
    fontSize: p.td(36),
    position: 'absolute',
    left: p.td(30),
    bottom: p.td(118)
  },
  mobile: {
    lineHeight: p.td(58),
    width: p.td(380),
    color: '#fff',
    fontSize: p.td(48),
    fontWeight: 'bold',
    position: 'absolute',
    left: p.td(30),
    bottom: p.td(62)
  },
  container: {
    width: p.td(750),
    backgroundColor: 'rgba(0,0,0, 0.6)',
    height: p.h,
    // bottom: 0,
    position: 'absolute',
    top: 0,

  },
  clickArea: {
    position: 'absolute',
    width: p.td(180),
    right: 0,
    top: 0,
    height: p.h,
  },
  myBar: {
    backgroundColor: '#fff',
    width: p.td(570),
    position: 'absolute',
    top: 0,
    left: 0,
    height: p.h,
    overflow: 'hidden',
    transform: [
      { translateX: - p.td(570) }
    ]
  },
  header: {
    width: p.td(570),
    height: p.td(302),
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: tm.mainColor,

  }
});
