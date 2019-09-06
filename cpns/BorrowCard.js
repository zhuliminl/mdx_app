import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {p} from '../utils/p';
import api from '../utils/api'
import RedBtn from './small/RedBtn'
import Loading from "./small/Loading";
const moment = require('moment');

export default class BorrowCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      disabled: false,
      isOver: false,
      showLoading: false,
      fakeMoney: 10000,
      fakeMoneyLoaded: false
    };
  }

  // checkOver(props){
  //   if(!(props.order && props.order.ok_at)) return;
  //   const endDate = moment(moment(props.order.ok_at).add(props.order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00'));
  //   const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
  //   this.setState({isOver: endDate.unix() < nowDate.unix()});
  // }


  async componentWillReceiveProps(nextProps){
    await this.setState({disabled: nextProps.disabled, isOver: nextProps['isOverForBorrowCard']});
    //this.checkOver(nextProps);
    // this.loadFee();
  }

  getSubTitleTextView(showStatus){
    switch(showStatus){
      case 2:
        return <Text style={[styles.te, styles.subTitle]}>即刻享用您的可用额度</Text>;
      case 3:
        if(this.state.isOver === true){
          return <Text style={[styles.te, styles.subTitle, styles.subTitleRed]}>当前借款已逾期！请速还款！</Text>;
        }
        if(this.props.order.is_backing === 1){
          return <Text style={[styles.te, styles.subTitle]}>还款处理中，请稍后刷新页面</Text>;
        }
        return <Text style={[styles.te, styles.subTitle]}>当前借款还清后可恢复额度</Text>;
      default:
        return <Text style={[styles.te, styles.subTitle]}>即刻领取您的可借额度</Text>
    }
  }

  getTitleText(){
    switch (this.props.showStatus){
      case 0:
        return '您最高可借(元)';
      case 1:
        return '您最高可借(元)';
      default:
        return '您的可用额度(元)';
    }
  }

  getShowMoney(){
    switch (this.props.showStatus){
      case 0:
        return this.state.fakeMoney;
      case 1:
        return this.state.fakeMoney;
      case 2:
        return this.props.fee['max'] || 0;
      case 3:
        return this.props.fee['max'] - (this.props.order['money'] / 100) || 0;
      default:
        return 0;
    }
  }

  async loadFee(){
   // this.setState({showLoading: true});
    if(this.state.fakeMoneyLoaded === true) return;
    console.log('FIN load fee')
    const resp = await api.get('/users/fee');
    if(resp && resp['success'] === true){
      await this.setState({fakeMoney: resp['fee']['fake_money'], fakeMoneyLoaded: true});
    }
    //this.setState({showLoading: false});
  }

  componentDidMount() {
    this.loadFee();
  }

  getBackBtn(){
    if(this.props.showStatus === 3){
      return (
        <View style={styles.cardBtns}>
          <RedBtn reverse={true} style={[styles.cardBtn, styles.cardBtnLeft]} show={true} title='提额' onPress={() => {this.props.navigation.push('Upgrade')}}/>
          <RedBtn style={[styles.cardBtn, styles.cardBtnRight]} show={true} title='还款' onPress={() => {this.props.onPress(this.props.showStatus)}}/>
        </View>
      );
    }
    return null;

  }

  render() {
    const {showStatus} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.bg}/>
        <Text style={[styles.te, styles.title, this.state.isOver === true ? styles.titleRed : {}]}>{this.getTitleText()}</Text>
        <Text style={[styles.te, styles.money, this.state.isOver === true ? styles.titleRed : {}]}>{this.getShowMoney()}</Text>
        {this.getSubTitleTextView(showStatus)}
        <RedBtn disabled={this.state.disabled} style={styles.rb}
                show={showStatus === 0}
                title='立即登录'
                onPress={() => {this.props.onPress(showStatus)}}/>

        <RedBtn disabled={this.state.disabled} style={styles.rb}
                title='立即激活'
                show={showStatus === 1}
                onPress={() => {this.props.onPress(showStatus)}}/>

        <RedBtn disabled={this.state.disabled} style={styles.rb}
                title='立即借款'
                show={showStatus === 2}
                onPress={() => {this.props.onPress(showStatus)}}/>
        {this.getBackBtn()}
        <Image style={styles.shadow} source={require('../images/borrow-card-shadow.png')}/>
        <Loading show={this.state.showLoading}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardBtnLeft: {
    left: p.td(44)
  },
  cardBtnRight: {
    right: p.td(44)
  },
  cardBtn: {
    width: p.td(268),
    height: p.td(100),
    position: 'absolute',
    bottom: 0
  },
  cardBtns: {
    width: p.td(684),
    height: p.td(100),
    position: 'absolute',
    left: 0,
    bottom: p.td(155),
    zIndex: 3
  },
  container: {
    width: p.td(684),
    height: p.td(639),
    backgroundColor: 'transparent',
    borderRadius: p.td(24),
    position: 'absolute',
    top: p.td(518),
    left: p.td(33)
  },
  bg: {
    width: p.td(684),
    height: p.td(536),
    borderRadius: p.td(24),
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex:1,
  },
  te: {
    position: 'absolute',
    width: p.td(684),
    textAlign: 'center',
    zIndex:2,
  },
  title: {
    fontSize: p.td(32),
    color: '#000',
    fontWeight: 'bold',
    top: p.td(68),
    lineHeight: p.td(46),
    fontWeight: 'bold',
  },
  titleRed: {
    color: '#E73939',
  },
  money: {
    fontSize: p.td(110),
    color: '#000',
    fontFamily: 'HelveticaNeue-Medium',
    top: p.td(142),
    lineHeight: p.td(132),
  },
  subTitle: {
    fontSize: p.td(30),
    color: '#4F5A6E',
    top: p.td(300),
    lineHeight: p.td(40),
    letterSpacing: p.td(12),
  },
  subTitleRed: {
    color: '#E73939',
    letterSpacing: p.td(12),
  },
  rb: {
    position: 'absolute',
    top: p.td(384),
    left: p.td(138),
    zIndex:2,
  },
  shadow: {
    width: p.td(598),
    height: p.td(103),
    position: 'absolute',
    left: p.td(43),
    bottom: 0,
    zIndex: 0
  }
});
