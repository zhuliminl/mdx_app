import React from "react";
import {StyleSheet, TouchableOpacity, Text, Image} from "react-native";
import { p } from "../../utils/p";

import { tm } from '../../utils/theme'

const { icons } = tm;

export default class HeaderBackBtn extends  React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <TouchableOpacity style={[styles.bo, this.props.style]} onPress={() => {
        console.log('FIN 返回')
        const state = this.props.navigation.state
        const reBack = state.params && state.params['reBack']
        if(reBack){
          console.log('FIN 执行 reBack')
          return reBack();
        }
        this.props.navigation.pop();
      }}>
        <Image
          style={styles.icon}
          source={icons.back}
        />
        <Text style={styles.text}>返回</Text>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  bo: {
    height: p.td(88),
    width: p.td(144),
    position: 'relative',
    //backgroundColor: '#000',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  icon: {
    position: 'absolute',
    left: p.td(20),
    bottom: p.td(28),
    width: p.td(32),
    height: p.td(32)
  },
  text: {
    fontSize: p.td(32),
    lineHeight: p.td(88),
    color: tm.mainColor,
    position: 'absolute',
    left: p.td(56),
  }
});
