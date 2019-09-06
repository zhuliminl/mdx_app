import PubSub from "pubsub-js";
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import RedBtn from "../cpns/small/RedBtn";
import { p } from "../utils/p";
import { tm } from '../utils/theme';

class AuthFailed extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '评分不足'
    }

  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.navigation.setParams({ reBack: () => {this.props.navigation.navigate('Home')} });

    this.props.navigation.setParams({
      reBack: () => {
        this.props.navigation.navigate('Home');
        PubSub.publish('BACK_HOME', 'BorrowDetail');
      }
    });

  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Image style={styles.icon} source={require('../images/icons/tan.png')} />
        <View style={styles.textLine}>
          <Text style={styles.text}>{'很抱歉，您的综合评分不足，暂时无法借款，请继续保持良好的信用记录，下次再来试试吧！'}</Text>
        </View>
        <RedBtn style={styles.ok} title='确定' show={true} onPress={() => { this.props.navigation.navigate('Home'); PubSub.publish('BACK_HOME', 'BorrowDetail'); }} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  icon: {
    width: p.td(164),
    height: p.td(164),
    position: 'absolute',
    top: p.td(140),
    left: p.td(293)
  },
  text: {
    fontSize: p.td(30),
    color: '#3E475B',
    lineHeight: p.td(42),
  },
  textLine: {
    position: 'absolute',
    width: p.td(600),
    left: p.td(75),
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
  ok: {
    position: 'absolute',
    bottom: p.td(224),
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
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },

});
export default createStackNavigator({
  AuthFailed: {
    screen: AuthFailed
  }
}, {
  initialRouteName: 'AuthFailed',
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
