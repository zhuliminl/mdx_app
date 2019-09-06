import PubSub from 'pubsub-js';
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from "react-native-slider";
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import api from '../utils/api';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';

const { icons } = tm;

const accounting = require('accounting');


const getDays7Icon = () => {
  return icons.sevenDay
};



class BorrowCenter extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '借款'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      slider: {
        step: 0,
        min: 0,
        max: 0
      },
      feeRate: 0,
      showLoading: true,
      dayLength: 0,
      disabledNext: false
    };
  }

  componentWillUnmount() {
    if (this.sub) {
      PubSub.unsubscribe(this.sub);
    }
  }

  beforeBack() {
    PubSub.publish('BACK_HOME', 'BorrowCenter');
  }
  async componentDidMount() {
    this.props.navigation.setParams({
      reBack: () => {
        this.beforeBack();
        this.props.navigation.pop();
      }
    });

    if (!this.sub) {
      this.sub = PubSub.subscribe('BACK_BORROW_CENTER', () => {
        this.setState({ disabledNext: false });
      });

    }

    this.setState({ showLoading: true });
    const resp = await api.get('/settings/borrow');
    if (resp['success'] === true) {
      this.setState({ value: resp['max'], dayLength: resp['dayLength'], feeRate: resp['feeRate'], slider: { step: resp['step'], min: resp['min'], max: resp['max'] } });
    }
    this.setState({ showLoading: false });

    console.log(resp);
  }
  render() {
    const moneyTexts = [];
    const de = this.state.slider.min / this.state.slider.step;
    const st = 600 / (this.state.slider.max / this.state.slider.step - de);
    for (let i = this.state.slider.min / this.state.slider.step; i <= this.state.slider.max / this.state.slider.step; i++) {
      moneyTexts.push(<Text key={`key-${i}`} style={[styles.mgt, { left: p.td((i - de) * st) }]}>{i * this.state.slider.step}</Text>);
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.title}>选择借款金额(元)</Text>
          <Text style={styles.money}>{this.state.value}</Text>

          <View style={styles.moneyGroup}>
            {moneyTexts}
          </View>

          <Slider
            value={this.state.value}
            step={this.state.slider.step}
            style={styles.slider}
            trackStyle={styles.sliderTrackStyle}
            minimumValue={this.state.slider.min}
            maximumValue={this.state.slider.max}
            minimumTrackTintColor={tm.mainColor}
            maximumTrackTintColor='#D8D8D8'
            thumbStyle={styles.sliderThumbStyle}
            onValueChange={value => this.setState({ value })}
          />

          <Image style={styles.cardSelected} source={getDays7Icon()} />
          <View style={{
            backgroundColor: '#FFF',
            zIndex: 99999999,
            position: 'absolute',
            bottom: p.td(120),
            right: p.td(100),
          }}>
            <Text
              style={{
                fontSize: p.td(42),
                fontWeight: 'bold',
                color: tm.mainColor,
              }}
            >借{this.state.dayLength}天</Text>
          </View>

        </View>
        <Image style={styles.shadow} source={require('../images/borrow-card-shadow.png')} />
        <View style={styles.infoCard}>
          <View style={styles.themeBar} />
          <Text style={styles.OT}>借款单</Text>
          <Text style={styles.OPT}>¥</Text>
          <Text style={styles.OMoney}>{this.state.value}</Text>
          <Text style={[styles.OFee, styles.OTE]}>综合费用：{accounting.formatNumber(this.state.value * this.state.feeRate, 2, '')}元</Text>
          <Text style={[styles.OReal, styles.OTE]}>到账金额：{accounting.formatNumber(this.state.value * (1 - this.state.feeRate), 2, '')}元</Text>
          <Text style={[styles.ODays, styles.OTE]}>借款期限：{this.state.dayLength}天</Text>
          <TouchableOpacity disabled={this.state.disabledNext} style={styles.nextBtnOuter} onPress={() => { this.goNext() }}>
            <View style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>选好了，下一步</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Image style={[styles.shadow, styles.shadow2]} source={require('../images/borrow-card-shadow.png')} />
        <Loading show={this.state.showLoading} />
      </View>
    );
  }


  async goNext() {
    if (this.state.value <= 0) return Toast('借款金额必须大于0');

    await this.setState({ disabledNext: true });
    this.props.navigation.push('BorrowConfirm', { r: { value: this.state.value, feeRate: this.state.feeRate, dayLength: this.state.dayLength } })
  }


}


const styles = StyleSheet.create({
  mgt: {
    fontSize: p.td(20),
    color: '#4F5A6E',
    lineHeight: p.td(28),
    fontFamily: 'HelveticaNeue',
    position: 'absolute',
    top: p.td(10)
  },
  moneyGroup: {
    width: p.td(650),
    height: p.td(50),
    //backgroundColor: '#ddd',
    position: 'absolute',
    left: p.td(50),
    top: p.td(274)
  },
  nextBtnOuter: {
    position: 'absolute',
    right: p.td(56),
    top: p.td(56)
  },
  nextBtnText: {
    color: '#fff',
    fontSize: p.td(30),
    width: p.td(320),
    height: p.td(76),
    lineHeight: p.td(76),
    textAlign: 'center'
  },
  nextBtn: {
    backgroundColor: tm.mainColor,
    width: p.td(320),
    height: p.td(76),
    borderRadius: p.td(38),
  },
  OFee: {
    left: p.td(44),
    bottom: p.td(104)
  },
  OReal: {
    left: p.td(44),
    bottom: p.td(28)
  },
  ODays: {
    right: p.td(44),
    bottom: p.td(104),
    textAlign: 'right'
  },
  OTE: {
    color: '#4F5A6E',
    fontSize: p.td(30),
    position: 'absolute',
    lineHeight: p.td(42),
  },
  OPT: {
    color: '#000',
    lineHeight: p.td(46),
    height: p.td(46),
    position: 'absolute',
    left: p.td(46),
    top: p.td(102),
    fontSize: p.td(30),
    fontFamily: 'HelveticaNeue-Medium',
  },
  OMoney: {
    color: '#000',
    lineHeight: p.td(68),
    height: p.td(68),
    position: 'absolute',
    left: p.td(70),
    top: p.td(94),
    fontSize: p.td(48),
    fontFamily: 'HelveticaNeue-Medium',
  },
  OT: {
    width: p.td(206),
    height: p.td(48),
    color: '#646464',
    fontSize: p.td(32),
    lineHeight: p.td(48),
    position: 'absolute',
    left: p.td(46),
    top: p.td(30),
  },
  themeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: p.td(14),
    height: p.td(332),
    backgroundColor: tm.mainColor
  },
  infoCard: {
    width: p.td(684),
    height: p.td(332),
    overflow: 'hidden',
    borderRadius: p.td(24),
    backgroundColor: '#fff',
    position: 'absolute',
    top: p.td(740),
    left: p.td(34),
    zIndex: 1,
  },
  shadow: {
    width: p.td(628),
    height: p.td(108),
    position: 'absolute',
    left: p.td(61),
    top: p.td(680),
    zIndex: 0
  },
  shadow2: {
    top: p.td(1072),
  },
  cardSelected: {
    width: p.td(636),
    height: p.td(152),
    position: 'absolute',
    top: p.td(454),
    left: p.td(62),
    zIndex: 9988899

  },
  slider: {
    width: p.td(600),
    position: 'absolute',
    top: p.td(302),
    left: p.td(77)
  },
  sliderTrackStyle: {
    height: p.td(28),
    borderRadius: p.td(14)
  },
  sliderThumbStyle: {
    width: p.td(64),
    height: p.td(64),
    borderRadius: p.td(32),
    borderWidth: p.td(6),
    borderColor: tm.mainColor,
    backgroundColor: '#fff'
  },
  money: {
    width: p.td(750),
    height: p.td(132),
    position: 'absolute',
    top: p.td(120),
    fontSize: p.td(110),
    color: tm.mainColor,
    fontFamily: 'HelveticaNeue-Medium',
    textAlign: 'center'
  },
  header: {
    backgroundColor: '#fff',
    width: p.td(750),
    height: p.td(680),
    zIndex: 1
  },
  title: {
    width: p.td(750),
    height: p.td(48),
    position: 'absolute',
    top: p.td(46),
    fontSize: p.td(32),
    color: '#000',
    textAlign: 'center'
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

});
export default createStackNavigator({
  BorrowCenter: {
    screen: BorrowCenter
  },
}, {
  initialRouteName: 'BorrowCenter',
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
