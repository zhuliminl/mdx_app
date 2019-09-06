import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { p } from "../../utils/p";

const fadeStyle = {
  opacity: 0.5,
}

export default ({ authStatus, needAliPay }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.item, { ...(authStatus['UD'] !== 'finished' && fadeStyle) }]}>
        <Image style={styles.iconUD} source={require('../../images/icons/auth/sm.png')} />
        <Image style={styles.arrow} source={require('../../images/icons/arrow-dblue.png')} />
      </View>

      <View style={[styles.item, { ...(authStatus['carrier'] !== 'finished' && fadeStyle) }]}>
        <Image style={styles.iconCarrier} source={require('../../images/icons/auth/yy.png')} />
        <Image style={styles.arrow} source={require('../../images/icons/arrow-dblue.png')} />
      </View>

      {needAliPay &&
        <View style={[styles.item, { ...(authStatus['aliPay'] !== 'finished' && fadeStyle) }]}>
          <Image style={styles.iconAlipay} source={require('../../images/icons/auth/ali.png')} />
          <Image style={styles.arrow} source={require('../../images/icons/arrow-dblue.png')} />
        </View>
      }

      <View style={[{ ...(authStatus['bank'] !== 'finished' && fadeStyle) }]}>
        <Image style={styles.iconBank} source={require('../../images/icons/auth/yh.png')} />
      </View>
    </View>
  )
}

const proportion = 1.1
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: p.td(1),
    marginBottom: p.td(30),
    padding: p.td(30),
    paddingVertical: p.td(80),
    justifyContent: 'space-around',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    position: 'relative',
    left: p.td(20),
    top: -p.td(10),
    width: p.td(16),
    height: p.td(26),
  },
  iconUD: {
    width: p.td(92) * proportion,
    height: p.td(76) * proportion,
  },
  iconCarrier: {
    width: p.td(117) * proportion,
    height: p.td(76) * proportion,
  },
  iconAlipay: {
    width: p.td(117) * proportion,
    height: p.td(75) * proportion,
  },
  iconBank: {
    width: p.td(117) * proportion,
    height: p.td(76) * proportion,
  },
})

