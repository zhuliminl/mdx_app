import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {p} from "../utils/p";
import { tm } from '../utils/theme'


export default class BorrowFailed extends React.Component {


  constructor(props) {
    super(props);
  }

  render() {
    let {show} = this.props;
    if(show){
      return (
        <View style={styles.container}>
          <View style={styles.bg}>
            <Text style={styles.title}>{this.props.title || '评分不足'}</Text>
            <Text style={styles.content}>{this.props.content || '很抱歉，您的综合评分不足，暂时无法借款，请继续保持良好的信用记录，下次再来试试吧！'}</Text>
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
  content: {
    color: '#888',
    fontSize: p.td(30),
    lineHeight:p.td(40),
    position: 'absolute',
    left: p.td(44),
    top: p.td(166),
    width: p.td(452)
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
    height: p.td(430),
    borderRadius: p.td(14),
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
