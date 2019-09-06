import { StyleSheet } from "react-native";
import { p } from "../utils/p";
import { tm } from '../utils/theme';

exports.HomeStyles = StyleSheet.create({
  container: {
    width: p.td(750),
    backgroundColor: 'transparent',
    position: 'relative',
  },
  containerAndroid: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  noticeAlertPanel: {
    width: p.td(600),
    backgroundColor: '#fff',
    borderRadius: p.td(12),
    overflow: 'hidden'
  },
  noticeAlertOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 999
  },
  btnArea: {
    width: p.td(600),
    height: p.td(90),
    borderTopColor: tm.mainColor,
    borderTopWidth: p.td(2),
    position: 'relative'
  },
  btnText: {
    color: tm.mainColor,
    fontSize: p.td(32),
    lineHeight: p.td(88),
    height: p.td(88),
    textAlign: 'center'
  },
  btnTextOuter: {
    width: p.td(600),
    height: p.td(88),
  },
  btnTextTwo: {
    position: 'absolute',
    bottom: 0
  },
  btnTextSecond: {
    width: p.td(300),
    borderLeftColor: tm.mainColor,
    borderLeftWidth: p.td(2),
    right: 0
  },
  btnTextFirst: {
    width: p.td(300),
    left: 0
  },
  titleText: {
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomColor: 'rgb(210, 210, 210)',
    borderBottomWidth: p.td(2),
    lineHeight: p.td(88),
    height: p.td(90),
    textAlign: 'center',
    fontSize: p.td(32),
    color: '#555'
  },
  bodyText: {
    fontSize: p.td(26),
    paddingLeft: p.td(60),
    paddingRight: p.td(60),
    paddingTop: p.td(38),
    paddingBottom: p.td(38),
    lineHeight: p.td(38),
    color: '#666'
  }
});
