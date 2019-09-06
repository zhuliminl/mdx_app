import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {View} from "react-native";



export default class Loading extends React.Component {
  constructor(props){
    super(props);
    this.state = {show: false};
  }
  componentWillReceiveProps(nextProps) {
    this.setState({show: nextProps['show'] || false})
  }
  render (){
    const {text} = this.props;
    if(this.state.show === true){
      return (
        <View style={[{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', position: 'absolute',
          zIndex: 999,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0}, this.props.style]}>
          <Spinner
            visible={true}
            textContent={text || '加载中...'}
            textStyle={{color: '#FFF'}}
            overlayColor='rgba(0, 0, 0, 0)'
          />
        </View>
      )
    }

    return null;

  }

}
