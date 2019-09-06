import React from 'react';
import {StyleSheet, Platform, Text, View, Image, TouchableOpacity} from 'react-native';
import {p} from '../utils/p';
import { tm, banner } from '../utils/theme'

export default class HomeHeader extends React.Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.colorBg}/>
        <Text style={styles.subTitle}>{this.props.slogan ? this.props.slogan.desc: ''}</Text>
        <Text style={styles.title}>{this.props.slogan ? this.props.slogan.title : ''}</Text>
        <Image style={styles.bg} source={banner}/>
        <TouchableOpacity style={[styles.topIconOuter, styles.rightTopIcon]} onPress={this.props['onRightClick'] ? this.props['onRightClick'] : undefined}>
          <Image style={[styles.topIcon]} source={require('../images/icons/msg.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.topIconOuter, styles.leftTopIcon]} onPress={this.props['onLeftClick'] ? this.props['onLeftClick'] : undefined}>
          <Image style={[styles.topIcon]} source={require('../images/icons/my.png')}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: p.td(750),
    height: p.td(664),
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'visible'
  },
  colorBg: {
    // width: p.td(750),
    // height: p.td(600),
    width: p.td(1200),
    height: p.td(1200),
    backgroundColor: tm.mainColor,
    // backgroundColor: '#000',
    position: 'absolute',
    top: -p.td(500),
    // left: 0,
    left: -(p.td(1200) - p.td(750))/2,
    borderRadius: p.td(500),
  },
  subTitle: {
    letterSpacing: p.td(8),
    color: '#fff',
    fontSize: p.td(30),
    lineHeight: p.td(42),
    textAlign: 'center',
    marginTop: p.td(178),
    zIndex: 10,
  },
  title: {
    color: '#fff',
    lineHeight: p.td(68),
    textAlign: 'center',
    marginTop: p.td(20),
    fontSize: p.td(48),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: p.td(2)},
    textShadowRadius: p.td(12),
    fontWeight: 'bold',
    zIndex: 10,
  },
  _bg: {
    width: p.td(750),
    height: p.td(250),
    position: 'absolute',
    left: 0,
    bottom: p.td(64),
    zIndex:10
  },
  bg: {
    position: 'relative',
    top: -45,
    marginLeft: p.td(80),
    width: p.td(500)*1.2,
    height: p.td(400)*1.2,
  },
  bottomBg: {
    width: p.td(750),
    height: p.td(64),
    position: 'absolute',
    left: 0,
    bottom: p.td(0),
    zIndex: 2
  },
  topIcon: {
    width: p.td(42),
    height: p.td(42),

  },
  topIconOuter: {
    width: p.td(92),
    height: p.td(88),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // bottom: p.td(504)
    top: Platform.OS === 'ios' ? p.td(80) : p.td(20)
  },
  leftTopIcon: {
    left: 0
  },
  rightTopIcon: {
    right: 0
  }
});
