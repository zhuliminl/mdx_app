/*
 * Created by Saul at 2019/06/05
 *
 * 获取主题配置信息
 *
 */

import config from './nativeConfig';


let themeName = config.theme
// let themeName = 'green'
let bannerType = config.bannerType || 'typeA'   // 不同的 banner， abc 三种

// let themeName = 'red'
// let bannerType = config.bannerType || 'typeB'   // 不同的 banner， abc 三种

const theme = {
  red: {
    mainColor: '#e73939',
    mainColorHex: 0xE73939ff,
    icons: {
      sideBar: {
        card: require('../images/theme/icon/red/card-1.png'),
        waiting: require('../images/theme/icon/red/waiting.png'),
        borrowOrder: require('../images/theme/icon/red/borrow-order.png'),
        upgrade: require('../images/theme/icon/red/upgrade.png'),
        feedback: require('../images/theme/icon/red/feedback.png'),
      },
      defaultPage: {
        messageBlank: require('../images/theme/icon/red/no_message.png'),
        netError: require('../images/theme/icon/red/cup.png'),
        orderBlank: require('../images/theme/icon/red/1.png'),
      },
      back: require('../images/theme/icon/red/back.png'),
      upgradeBg: require('../images/theme/icon/red/version-header-bg.png'),
      msg1: require('../images/theme/icon/red/msg1.png'),
      msg2: require('../images/theme/icon/red/msg2.png'),
      sevenDay: require('../images/theme/icon/red/7days.png'),
      contact: require('../images/theme/icon/red/contact.png'),
    },
  },
  blue: {
    mainColor: '#1f83da',
    mainColorHex: 0xE73939ff,
    icons: {
      sideBar: {
        card: require('../images/theme/icon/blue/card-1.png'),
        waiting: require('../images/theme/icon/blue/waiting.png'),
        borrowOrder: require('../images/theme/icon/blue/borrow-order.png'),
        upgrade: require('../images/theme/icon/blue/upgrade.png'),
        feedback: require('../images/theme/icon/blue/feedback.png'),
      },
      defaultPage: {
        messageBlank: require('../images/theme/icon/blue/no_message.png'),
        netError: require('../images/theme/icon/blue/cup.png'),
        orderBlank: require('../images/theme/icon/blue/1.png'),
      },
      back: require('../images/theme/icon/blue/back.png'),
      upgradeBg: require('../images/theme/icon/blue/version-header-bg.png'),
      msg1: require('../images/theme/icon/blue/msg1.png'),
      msg2: require('../images/theme/icon/blue/msg2.png'),
      sevenDay: require('../images/theme/icon/blue/7days.png'),
      contact: require('../images/theme/icon/blue/contact.png'),
    },
  },
  green: {
    mainColor: '#21756a',
    mainColorHex: 0xE73939ff,
    icons: {
      sideBar: {
        card: require('../images/theme/icon/green/card-1.png'),
        waiting: require('../images/theme/icon/green/waiting.png'),
        borrowOrder: require('../images/theme/icon/green/borrow-order.png'),
        upgrade: require('../images/theme/icon/green/upgrade.png'),
        feedback: require('../images/theme/icon/green/feedback.png'),
      },
      defaultPage: {
        messageBlank: require('../images/theme/icon/green/no_message.png'),
        netError: require('../images/theme/icon/green/cup.png'),
        orderBlank: require('../images/theme/icon/green/1.png'),
      },
      back: require('../images/theme/icon/green/back.png'),
      upgradeBg: require('../images/theme/icon/green/version-header-bg.png'),
      msg1: require('../images/theme/icon/green/msg1.png'),
      msg2: require('../images/theme/icon/green/msg2.png'),
      sevenDay: require('../images/theme/icon/green/7days.png'),
      contact: require('../images/theme/icon/green/contact.png'),
    },
  },
  yellow: {
    mainColor: '#e4b508',
    mainColorHex: 0xE73939ff,
    icons: {
      sideBar: {
        card: require('../images/theme/icon/yellow/card-1.png'),
        waiting: require('../images/theme/icon/yellow/waiting.png'),
        borrowOrder: require('../images/theme/icon/yellow/borrow-order.png'),
        upgrade: require('../images/theme/icon/yellow/upgrade.png'),
        feedback: require('../images/theme/icon/yellow/feedback.png'),
      },
      defaultPage: {
        messageBlank: require('../images/theme/icon/yellow/no_message.png'),
        netError: require('../images/theme/icon/yellow/waiting.png'),
        orderBlank: require('../images/theme/icon/yellow/1.png'),
      },
      back: require('../images/theme/icon/yellow/back.png'),
      upgradeBg: require('../images/theme/icon/yellow/version-header-bg.png'),
      msg1: require('../images/theme/icon/yellow/msg1.png'),
      msg2: require('../images/theme/icon/yellow/msg2.png'),
      sevenDay: require('../images/theme/icon/yellow/7days.png'),
      contact: require('../images/theme/icon/yellow/contact.png'),
    },
  },
}

const bannerMap = {
  typeA: require('../images/banner/banner1.png'),
  typeB: require('../images/banner/banner2.png'),
  typeC: require('../images/banner/banner3.png'),
}



export const tm = theme[themeName];
export const banner = bannerMap[bannerType]
