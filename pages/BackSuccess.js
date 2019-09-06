import PubSub from "pubsub-js";
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import RedBtn from "../cpns/small/RedBtn";
import { p } from "../utils/p";
import { tm } from '../utils/theme';


class BackSuccess extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '还款处理中'
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
        <Image style={styles.icon} source={require('../images/icons/ok.png')} />
        <View style={styles.textLine}>
          <Text style={styles.text}>{'还款处理中...'}</Text>
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
  BackSuccess: {
    screen: BackSuccess
  }
}, {
  initialRouteName: 'BackSuccess',
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
