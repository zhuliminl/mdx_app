import React from 'react';
import { View, Text, StyleSheet, NativeModules, SectionList, Platform, Image, TouchableOpacity, StatusBar } from 'react-native';
import RNRestart from 'react-native-restart';
import { p } from './p'
import bugsnag from './bugsnag'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    bugsnag.notify(error)
    // Display fallback UI
    this.setState({ hasError: true });
    console.log('FIN Error', error)
    console.log('FIN Error Info', info)
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={styles.container}>
          <Image
            style={styles.bugImage}
            source={require('../images/bug.png')}
          />
          <Text>
            哎呀,出错了
          </Text>
          <TouchableOpacity
            style={styles.goback}
            onPress={() => {
              RNRestart.Restart()
            }}
          >
            <Text style={styles.gobackText}>
              返回重试
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bugImage: {
    width: p.td(300),
    height: p.td(300),
  },
  goback: {
    marginTop: p.td(40),
    paddingVertical: p.td(20),
    paddingHorizontal: p.td(50),
    borderRadius: p.td(5),
    backgroundColor: '#F5F6F7',
  },
  gobackText: {
    color: 'red',
  }
})

export default ErrorBoundary
