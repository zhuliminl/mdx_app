import React from 'react';
import {StyleSheet} from 'react-native';
import { p } from '../../utils/p';
import { tm } from '../../utils/theme'
import Button from 'react-native-button'
const _ = require('lodash');

const btnC = {
  height: p.td(100),
  width: p.td(410),
  backgroundColor: tm.mainColor,
  borderRadius: p.td(100),

};

class RedBtn extends React.Component {
  constructor(props){
    super(props);

  }
  render (){
    const {show, letterSpacing, disabled} = this.props;
    if(show !== true) return null;
    let spStyle = {};
    if(letterSpacing){
      spStyle = {letterSpacing: p.td(letterSpacing)};
    }
    return <Button allowFontScaling={false} onPress={() => {this.props.onPress ? this.props.onPress() : null}}
                   style={[styles.btnS, this.props.reverse ? styles.btnSReverse : {}, spStyle]}
                   disabled={disabled}
                   styleDisabled={[styles.styleDisabled, this.props.disabledStyle ? this.props.disabledStyle['color'] : {}]}
                   disabledContainerStyle={[styles.disabledStyle, this.props.disabledStyle]}
                   containerStyle={[styles.btnC, this.props.reverse ? styles.btnCReverse : {}, this.props['style']]}
                   color={tm.mainColor} title="">
      {this.props['title'] || '一个按钮'}
      </Button>;
  }

}

export default RedBtn;

const styles = StyleSheet.create({
  disabledStyle: {
    backgroundColor: '#CCCCCC'
  },
  styleDisabled: {
    color: '#4F5A6E'
  },
  btnS: {
    fontSize: p.td(36),
    color: '#fff',
    lineHeight: p.td(100),
    fontWeight: 'bold',
    letterSpacing: p.td(6),
    //allowFontScaling: false
  },
  btnSReverse: {
    color: tm.mainColor,
    lineHeight: p.td(96),
  },
  btnC: {
    height: p.td(100),
    width: p.td(410),
    backgroundColor: tm.mainColor,
    // borderRadius: p.td(100),
    borderRadius: p.td(15),
  },
  btnCReverse: {
    backgroundColor: '#fff',
    borderColor: tm.mainColor,
    borderWidth: p.td(2)
  }
});
