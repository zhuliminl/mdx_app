import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import api from '../utils/api';
import { p } from '../utils/p';
import { tm } from '../utils/theme';
import Toast from '../utils/toast';
const accounting = require('accounting');




class Upgrade extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '提额'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      mobile: null,
      money: 0,
      submitable: false,
      showLoading: false,
      subTitle: ''
    };
  }

  async getStatus() {
    this.setState({ showLoading: true });
    const resp = await api.get('/upgrade/status');
    this.setState({ showLoading: false });
    this.setState({
      subTitle: `您最高可提额至${resp['max_upgrade']}元\n快来申请试试吧`
    });
    if (resp['success']) {
      this.setState({
        money: resp['max_money'],
        submitable: resp['submitable']
      });

      if (!resp['submitable']) {
        this.setState({ subTitle: `您的提额申请已提交\n最高可提额至${resp['max_upgrade']},具体额度由审核\n人员综合审查评定，请耐心等待。` });
      }

      if (resp['upgrade'] && resp['upgrade']['status'] === 1) {
        this.setState({ subTitle: `恭喜您！\n授信额度提升至${this.state.money}元` });
      }
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
    this.getStatus();
  }

  async submit() {
    this.setState({ showLoading: true });
    const resp = await api.post('/upgrade');
    if (resp['success'] === true) {
      Toast('提额申请提交成功')
    }
    this.setState({ showLoading: false });
    this.getStatus();
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.subTitle}>您的当前额度(元)</Text>
          <Text style={styles.money}>
            {accounting.formatNumber(this.state.money, 0, ',')}
          </Text>
        </View>

        <Text style={styles.notice}>{this.state.subTitle}</Text>
        <RedBtn disabled={!this.state.submitable} style={styles.logout} title='提额' show={true} onPress={() => { this.submit() }} />
        <Loading show={this.state.showLoading} />
      </View>
    );
  }


}


const styles = StyleSheet.create({
  notice: {
    color: '#4F5A6E',
    width: p.td(750),
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    top: p.td(420),
    fontSize: p.td(30),
  },
  money: {
    // textShadowColor: 'rgba(231,57,57, 0.30)',
    textShadowColor: tm.mainColor,
    shadowOpacity: 0.03,
    textShadowOffset: { width: p.td(2), height: p.td(8) },
    textShadowRadius: p.td(20),
    textAlign: 'center',
    width: p.td(750),
    fontSize: p.td(110),
    height: p.td(132),
    lineHeight: p.td(132),
    fontFamily: 'HelveticaNeue-Medium',
    color: tm.mainColor,
    marginTop: p.td(14)
  },
  subTitle: {
    width: p.td(750),
    height: p.td(46),
    color: '#838B97',
    lineHeight: p.td(46),
    fontSize: p.td(32),
    textAlign: 'center',
    marginTop: p.td(70),
  },
  header: {
    width: p.td(750),
    height: p.td(344),
    backgroundColor: '#fff'
  },
  logout: {
    position: 'absolute',
    top: p.td(588),
    left: p.td(225),
    zIndex: 2,
    width: p.td(300)
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
  Upgrade: {
    screen: Upgrade
  }
}, {
  initialRouteName: 'Upgrade',
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
