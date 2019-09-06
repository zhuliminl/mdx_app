import React from 'react';
import { Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, View, WebView } from 'react-native';
import Pdf from 'react-native-pdf';
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from "../cpns/small/HeaderBackBtn";
import Loading from "../cpns/small/Loading";
import api from '../utils/api';
import { p } from "../utils/p";


class PWViewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showLoading: true,
      url: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    let title = navigation.getParam('title', '协议');
    if (!title) {
      title = '协议';
    }

    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: title
    }
  };

  async showPreContract(value, dayLength) {
    const resp = await api.post('/contracts/pre', { value, day_length: dayLength });
    this.setState({ type: 'webview', html: resp['html'] });
  }

  async showExistContract(orderId) {
    console.log('-----------------orderId', orderId);
    const resp = await api.get(`/contracts/orders/${orderId}`);
    if (resp && resp['success'] === true) {
      this.setState({ type: 'webview', html: resp['html'] });
    }
  }

  async showContract() {
    this.setState({ showLoading: true });
    const resp = await api.get('/settings/login_contracts');
    this.setState({ showLoading: false });
    if (resp['success'] === true) {
      this.setState({ url: resp.url });
    } else {
      this.setState({ url: 'https://fintechzx.oss-cn-hangzhou.aliyuncs.com/contracts/logup/0.1.4.pdf' });
    }
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.navigation.state.params['r'] && nextProps.navigation.state.params['r']['name']) {
      case 'BorrowContract':
        const { type, value, dayLength } = nextProps.navigation.state.params['r'];
        switch (type) {
          case 'pre_contract':
            this.showPreContract(value, dayLength);
            break;
          case 'exist_contract':
            const { orderId } = nextProps.navigation.state.params['r'];
            this.showExistContract(orderId);
            break;
        }
        break;
      case 'Logup':
        this.showContract();
        break;
      case 'Message':
        this.setState({ type: 'msg', title: nextProps.navigation.state.params['r']['title'], content: nextProps.navigation.state.params['r']['content'] })
    }
  }

  componentWillUnmount() {

  }

  componentDidMount() {
    this.props.navigation.setParams({ back: this.props.navigation.pop });
  }

  render() {

    if (this.state.type === 'webview') {
      return (
        <WebView
          originWhitelist={['*']}
          source={{ html: this.state.html, baseUrl: '' }}
        />
      );
    }


    if (this.state.type === 'msg') {
      return (
        <ScrollView style={styles.container} conatinerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <StatusBar hidden={false} barStyle="dark-content" />
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.content}>        {this.state.content}</Text>
        </ScrollView>
      );
    }

    if (!this.state.url) return null;
    const source = { uri: this.state.url, cache: true };
    //const source = require('./test.pdf');  // ios only
    //const source = {uri:'bundle-assets://test.pdf'};

    //const source = {uri:'file:///sdcard/test.pdf'};
    //const source = {uri:"data:application/pdf;base64,..."};

    return (
      <View style={[styles.container, { justifyContent: 'flex-start', alignItems: 'center' }]}>
        <StatusBar hidden={false} barStyle="dark-content" />
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            this.setState({ showLoading: false });
          }}
          onError={(error) => {
            console.log(error);
          }}
          style={styles.pdf} />

        <Loading show={this.state.showLoading} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: p.td(48),
    width: p.td(750),
    lineHeight: p.td(112),
    textAlign: 'center',
    color: '#000'
  },
  content: {
    marginTop: p.td(18),
    color: '#4F5A6E',
    fontSize: p.td(34),
    lineHeight: p.td(50),
    width: p.td(750),
    paddingLeft: p.td(30),
    paddingRight: p.td(30),
    textAlign: 'left',
  },
  container: {
    flex: 1, backgroundColor: '#fff'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  }
});


export default createStackNavigator({
  PWViewer: {
    screen: PWViewer
  }
}, {
  initialRouteName: 'PWViewer',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomColor: '#fff',
      elevation: 0,
      ...Platform.select({
        // android: {
        // height: 56 + StatusBar.currentHeight,
        // paddingTop: StatusBar.currentHeight
        // }
      }),
    },
    headerTitleStyle: {
      fontSize: p.td(36),
      color: '#4F5A6E'
    }
  }
});
