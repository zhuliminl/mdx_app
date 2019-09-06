import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Linking, Clipboard, AsyncStorage} from 'react-native';
import {p} from "../utils/p";
import { tm } from '../utils/theme'
import Toast from 'react-native-root-toast';


export default class BorrowFailed extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      sc: {}
    };
  }

  async componentDidMount() {
    const sc = await AsyncStorage.getItem('service_contact');
    if(sc) await this.setState({sc: JSON.parse(sc)});
  }

  getQQ(){
    if(this.state.sc.qq){
      return(
        <TouchableOpacity style={[styles.oLine, styles.oLineQQ]} onPress={() => {
          Clipboard.setString(this.state.sc.qq);
          Toast.show('QQ复制成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            hideOnPress: true
          });
        }}>
          <Image style={styles.oLineImage} source={require('../images/icons/qq.png')}/>
          <Text style={styles.oLineText}>{this.state.sc.qq}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  getWechat(){
    if(this.state.sc.wechat){
      return (
        <TouchableOpacity style={[styles.oLine, styles.oLineWechat]} onPress={() => {
          Clipboard.setString(this.state.sc.wechat);
          Toast.show('微信复制成功', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            hideOnPress: true
          });
        }}>
          <Image style={styles.oLineImage} source={require('../images/icons/wechat.png')}/>
          <Text style={styles.oLineText}>{this.state.sc.wechat}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    let {show} = this.props;
    if(show){
      return (
        <View style={styles.container}>
          <View style={styles.bg}>
            <Text style={styles.title}>{this.props.title || '还款失败-余额不足'}</Text>
            <Text style={styles.content}>{this.props.content || '本次还款失败了，请您联系客服以免逾期！'}</Text>

            <TouchableOpacity style={[styles.oLine, styles.oLineMobile]} onPress={() => {Linking.openURL(`tel:${this.state.sc.tel}`)}}>
              <Image style={styles.oLineImage} source={require('../images/icons/mobile.png')}/>
              <Text style={styles.oLineText}>{this.state.sc.tel}</Text>
            </TouchableOpacity>
            {this.getQQ()}
            {this.getWechat()}
            <TouchableOpacity style={styles.backBtn} onPress={() => {this.props.doHide()}}>
              <View style={styles.backBtnInner}>
                <Text style={styles.backBtnText}>返回</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;

  }

}


const styles = StyleSheet.create({
  oLineText: {
    lineHeight: p.td(46),
    fontSize: p.td(23)
  },
  oLineImage: {
    position: 'absolute',
    left: 0,
    top:0,
    width: p.td(46),
    height: p.td(46)
  },
  oLineMobile: {
    bottom: p.td(332)
  },
  oLineQQ: {
    bottom: p.td(240)
  },
  oLineWechat: {
    bottom: p.td(146)
  },
  oLine:{
    height: p.td(46),
    position: 'absolute',
    left: p.td(154),
    paddingLeft: p.td(66)
  },
  content: {
    color: '#888',
    fontSize: p.td(30),
    lineHeight:p.td(40),
    position: 'absolute',
    left: p.td(45),
    top: p.td(166),
    width: p.td(450),
    textAlign: 'center'
  },
  backIcon: {
    width: p.td(40),
    height: p.td(40),
    position: 'absolute',
    left: 0,
    top: 0,
  },
  backBtnText: {
    color: tm.mainColor,
    fontSize: p.td(36),
  },
  backBtnInner: {
    height: p.td(100),
    width: p.td(540),
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    height: p.td(101),
    width: p.td(540),
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  title: {
    width: p.td(540),
    height: p.td(42),
    lineHeight: p.td(42),
    fontSize: p.td(36),
    color: '#000',
    position: 'absolute',
    left: 0,
    textAlign: 'center',
    top: p.td(62),
  },
  bg: {
    width: p.td(540),
    backgroundColor: '#fff',
    height: p.td(750),
    borderRadius: p.td(14),
    marginTop:p.td(-100)
    // position: 'absolute',
    // left: p.td(106),
    // top: p.td(166)
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex:200,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
