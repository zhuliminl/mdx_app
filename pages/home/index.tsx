import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { device } from '@/utils/device'
import SplashScreen from 'react-native-splash-screen';
import Foo from '@/components/foo'

export interface HomeProps {
}

export interface HomeState {
}

export default class HomePomponent extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
  }

  componentDidMount = () => {
    SplashScreen.hide()
  }

  public render() {
    return (
      <View
        style={styles.container}
      >
        <Text>HomePComponent</Text>
        <Foo />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: device.width,
    height: device.height,
    backgroundColor: 'red'
  }
})
