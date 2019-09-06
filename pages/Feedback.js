import React from 'react';
import { Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../cpns/small/HeaderBackBtn';
import Loading from "../cpns/small/Loading";
import RedBtn from "../cpns/small/RedBtn";
import api from '../utils/api';
import { p } from "../utils/p";
import { tm } from '../utils/theme';
import Toast from '../utils/toast';



class Feedback extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '意见反馈'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      content: null
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
  }



  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <StatusBar hidden={false} barStyle="dark-content" />
          <View style={styles.content} >
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid='transparent'
              placeholder='输入您要反馈的问题'
              selectionColor={tm.mainColor}
              returnKeyLabel='下一步'
              returnKeyType='next'
              placeholderTextColor='#b2b2b2'
              onChangeText={(content) => this.setState({ content })}
              maxLength={180}
              style={{ height: p.td(380), width: p.td(700), fontSize: p.td(32), color: '#4F5A6E', textAlignVertical: 'top' }}
              multiline={true} />
            <Text style={{ position: 'absolute', color: '#B2B2B2', right: p.td(48), bottom: p.td(50), fontSize: p.td(32), backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>{this.state.content ? this.state.content.length : 0}/180字</Text>
          </View>

          <Text style={styles.notice}>如有任何建议或问题，请反馈给我们{'\n'}感谢您的支持！</Text>



          <RedBtn reverse={true} style={styles.logout} title='提交' show={true} onPress={() => { this.submit() }} />
          <Loading show={this.state.showLoading} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  async submit() {
    const resp = await api.post('/users/feedback', { content: this.state.content });
    if (resp['success']) {
      Toast('意见反馈提交成功');
      this.props.navigation.pop();
    }
  }


}


const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    height: p.td(402),
    width: p.td(750),
    paddingTop: p.td(10),
    paddingBottom: p.td(10),
    paddingLeft: p.td(25),
    paddingRight: p.td(25),
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: p.td(2)
  },
  notice: {
    textAlign: 'center',
    width: p.td(550),
    lineHeight: p.td(42),
    fontSize: p.td(30),
    color: '#4F5A6E',
    left: p.td(100),
    position: 'absolute',
    bottom: p.td(444)
  },
  logout: {
    position: 'absolute',
    bottom: p.td(268),
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
  Feedback: {
    screen: Feedback
  }
}, {
  initialRouteName: 'Feedback',
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
