import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { banksIcon } from '../utils/banksIcon';
import { banksMapping } from '../utils/banksMapping';
import { p } from '../utils/p';
import { tm } from '../utils/theme';


export default class SupportedBanks extends React.Component {


  constructor(props) {
    super(props);
  }

  getBanks() {
    const banks = [];
    for (let bank of Object.keys(banksMapping)) {
      banks.push(
        <View key={bank} style={styles.item}>
          <Image style={styles.backIcon} source={banksIcon[bank]} />
          <Text style={styles.itemT}>{banksMapping[bank]}</Text>
        </View>
      );
    }
    return banks;
  }

  render() {
    let { show } = this.props;
    if (show) {
      return (
        <View style={styles.container}>
          <View style={styles.bg}>
            <Text style={styles.title}>可支持的银行卡</Text>
            <ScrollView style={styles.banksContainer} contentContainerStyle={styles.banksContainerC}>
              {this.getBanks()}
            </ScrollView>
            <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.doHide() }}>
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
  itemT: {
    position: 'absolute',
    left: p.td(54),
    top: 0,
    fontSize: p.td(30),
    color: '#888',
    lineHeight: p.td(40)
  },
  item: {
    width: p.td(300),
    height: p.td(40),
    marginBottom: p.td(32)
  },
  backIcon: {
    width: p.td(40),
    height: p.td(40),
    position: 'absolute',
    left: 0,
    top: 0,
  },
  banksContainer: {
    position: 'absolute',
    top: p.td(104),
    bottom: p.td(100),
    left: 0,
    right: 0
  },
  banksContainerC: {
    paddingTop: p.td(60),
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    height: p.td(740),
    borderRadius: p.td(14),
    position: 'absolute',
    left: p.td(106),
    top: p.td(166)
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },

});
