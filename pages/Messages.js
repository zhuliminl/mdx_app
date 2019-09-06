import React from 'react';
import { Image, Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import api from '../utils/api';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import DefaultPage from './common/DefaultPage';

const { icons } = tm;

const moment = require('moment');
const _icons = {
  red: {
    msg1: require('../images/icons/red/msg1.png'),
    msg2: require('../images/icons/red/msg2.png')
  }
};

const iconImage = _icons[p.tn];

class Messages extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '消息'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      msgs: []
    };
  }

  async onRefresh() {
    this.setState({ refreshing: true });
    setTimeout(async () => {
      await this.getData();
      this.setState({ refreshing: false });
    }, 500)

  }

  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
    this.getData();
  }

  async getData() {
    const resp = await api.get('/messages/my');
    const list = [];
    if (resp['messages'] && resp['messages'].length > 0) {
      for (let msg of resp['messages']) {
        list.push(
          <TouchableOpacity key={msg.id} style={styles.item} onPress={() => {
            this.props.navigation.navigate({ routeName: 'PWViewer', params: { r: { name: 'Message', title: msg.title, content: msg.content }, title: msg.title } });
          }}>
            {/*
            <Image style={styles.icon} source={iconImage[msg.type === 1 ? 'msg2': 'msg1']}/>
                */}
            <Image style={styles.icon} source={msg.type === 1 ? icons.msg2 : icons.msg1} />
            <Text style={styles.title}>{msg.title}</Text>
            <Text style={styles.desc} numberOfLines={1}>{msg.content}</Text>
            <Text style={styles.date}>{moment(msg.created_at).format('YYYY年MM月DD日')}</Text>
          </TouchableOpacity>
        );
      }
    }

    this.setState({ msgs: list });
  }
  render() {
    console.log('FIN message Page state', this.state)
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            progressBackgroundColor='#ddd'
            refreshing={this.state.refreshing}
            onRefresh={() => { this.onRefresh() }}
          />}
        style={styles.container}
        containerStyle={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <StatusBar
          backgroundColor={'#FFF'}
          barStyle="dark-content"
          hidden={this.state.refreshing === true} />
        {this.state.msgs}

        {(this.state.msgs && this.state.msgs.length === 0) ?
          <DefaultPage
            iconSource={icons.defaultPage.messageBlank}
            onBack={() => {
              this.props.navigation.pop()
            }}
            message={'您还没有任何通知哦,'}
            actionName={'返回首页'}
          />
          : null}
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  desc: {
    width: p.td(522),
    color: '#4F5A6E',
    fontSize: p.td(28),
    left: p.td(124),
    position: 'absolute',
    bottom: p.td(22),
    lineHeight: p.td(40),
    height: p.td(40)
  },
  title: {
    color: '#000',
    fontSize: p.td(34),
    lineHeight: p.td(48),
    position: 'absolute',
    top: p.td(22),
    left: p.td(124)
  },
  date: {
    color: '#ccc',
    position: 'absolute',
    fontSize: p.td(24),
    lineHeight: p.td(40),
    textAlign: 'right',
    right: p.td(20),
    top: p.td(24),
  },
  icon: {
    width: p.td(74),
    height: p.td(74),
    position: 'absolute',
    left: p.td(32),
    top: p.td(32)
  },
  item: {
    width: p.td(750),
    height: p.td(138),
    borderBottomColor: '#ddd',
    borderBottomWidth: p.td(2),
    backgroundColor: '#fff',
    position: 'relative'
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    flex: 1,
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },

});
export default createStackNavigator({
  Messages: {
    screen: Messages
  }
}, {
  initialRouteName: 'Messages',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      // backgroundColor: 'blue',
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
