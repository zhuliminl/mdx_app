import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {p} from '../utils/p';
import { tm } from '../utils/theme'
const moment = require('moment');

const { icons } = tm

const arrow = require('../images/icons/red/back.png');

export default class SmallCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isOver: false,
      overFee: 0
    };
  }


  async componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    await this.checkOver();
    this.forceUpdate();
  }


  async checkOver(){
    if(!(this.props.order && this.props.order.ok_at)) return;
    const endDate = moment(moment(this.props.order.ok_at).add(this.props.order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00'));
    const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00'));


    await this.setState({isOver: endDate.unix() < nowDate.unix()});

    if(this.state.isOver === true){
      const endDate = moment(moment(this.props.order.ok_at).add(this.props.order.day_length - 1, 'days').format('YYYY-MM-DD 00:00:00')).unix();
      const nowDate = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
      const overDays = (nowDate - endDate) / 86400;
      const dayMoney = this.props.order.money * this.props.overFee['day_rate'];
      const maxMoney = this.props.order.money * this.props.overFee['max_rate'];

      let overFee = overDays * dayMoney;

      if(maxMoney < overFee){
        overFee = maxMoney;
      }
      this.setState({overFee});
    }else{
      this.setState({overFee: 0});
    }
  }

  async componentDidMount() {
    await this.checkOver();
  }

  getBackDay(){
    switch (this.props.order.status){
      case 0:
        return <Text style={styles.backDay}>预计2小时内完成审核</Text>;
      case 1:
        return <Text style={styles.backDay}>已通过审核，正在放款</Text>;
      default:
        return <Text style={[styles.backDay, this.state.isOver ? {color: '#E73939'} : {}]}>还 款 日：{moment(this.props.order['ok_at']).add(this.props.order['day_length'] - 1, 'days').format('YYYY年MM月DD日')}</Text>;
    }


  }
  getRBImage(){
    switch(this.props.order.status){
      case 0:
        return <Image style={styles.rightBottom} source={require('../images/icons/c-normal.png')}/>;
      case 1:
        return <Image style={styles.rightBottom} source={require('../images/icons/c-banking.png')}/>;
      case 2:
        if(this.state.isOver === true){
          return <Image style={styles.rightBottom} source={require('../images/icons/c-waiting-over.png')}/>;
        }
        return <Image style={styles.rightBottom} source={require('../images/icons/c-waiting.png')}/>
    }
  }

  getTitle(){
    switch (this.props.order.status){
      case 0:
        return '借款申请单';
      case 1:
        return '借款单';
      case 2:
        return '借款单';
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.borderBg}/>
        <Text style={[styles.title, this.state.isOver ? {color: '#E73939'} : {}]}>{this.getTitle()}</Text>
        <Text style={[styles.moneyTag, this.state.isOver ? {color: '#E73939'} : {}]}>¥</Text>
        <Text style={[styles.money, this.state.isOver ? {color: '#E73939'} : {}]}>{(this.props.order['money'] + this.state.overFee) / 100}</Text>
        {this.getBackDay()}
        <TouchableOpacity style={styles.goView} onPress={this.props.onPress}>
          <Text style={[styles.goViewText, this.state.isOver ? {fontWeight: 'bold'} : {}]}>{this.state.isOver ? '订单已逾期' : '查看'}</Text>
          <Image style={styles.arrowRight} source={icons.back}/>
        </TouchableOpacity>
        {this.getRBImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rightBottom: {
    width: p.td(186),
    height: p.td(152),
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  goView: {
    width: p.td(684),
    height: p.td(232),
    zIndex: 4,
    right: 0,
    top: 0,
  },
  goViewText: {
    color: tm.mainColor,
    fontSize: p.td(32),
    position: 'absolute',
    textAlign: 'right',
    lineHeight: p.td(46),
    top: p.td(26),
    right: p.td(52),
  },
  arrowRight: {
    transform: [{ rotate: '180deg'}],
    width: p.td(16),
    height: p.td(26),
    position: 'absolute',
    top: p.td(36),
    right: p.td(26)
  },
  moneyTag: {
    position: 'absolute',
    color: '#000',
    fontSize: p.td(30),
    left: p.td(44),
    top: p.td(92),
    fontFamily: 'HelveticaNeue'
  },
  backDay: {
    position: 'absolute',
    left: p.td(44),
    color: '#4F5A6E',
    lineHeight: p.td(42),
    bottom: p.td(26),
    fontSize: p.td(30),
  },
  money: {
    position: 'absolute',
    color: '#000',
    lineHeight:p.td(68),
    left: p.td(72),
    fontFamily: 'HelveticaNeue-Medium',
    top: p.td(80),
    fontSize: p.td(48)
  },
  title: {
    height: p.td(46),
    fontSize: p.td(32),
    lineHeight: p.td(46),
    color: '#646464',
    position: 'absolute',
    left: p.td(44),
    top: p.td(26),
  },
  borderBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: tm.mainColor,
    width: p.td(14),
    height: p.td(232)
  },
  container: {
    width: p.td(684),
    height: p.td(232),
    backgroundColor: '#fff',
    borderRadius: p.td(24),
    position: 'absolute',
    left: p.td(33),
    top: p.td(1078),
    overflow: 'hidden'
  }
});
