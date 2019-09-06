import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { p } from "../../utils/p";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
}

const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
const itemHeight = p.td(40)

class SideSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      letters,
      activeIndex: 0,
    }
  }

  componentDidMount = () => {
    this.sub = PubSub.subscribe('TITLE_CHANGE', (msg, data) => {
      console.log('letter data', data)
      this.setState({
        // activeIndex: this.state.letters.indexOf(data)
      })
    })

  }

  componentWillUnmount = () => {
    PubSub.unsubscribe(this.sub);
  }

  setActive = i => {
    this.setState({
      activeIndex: i,
    })
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        {this.state.letters.map((item, i) => {
          return (
            <TouchableOpacity
              style={
                [styles.item,
                {
                  ...(this.state.activeIndex === i && {
                    backgroundColor: '#111',
                    borderRadius: p.td(40),
                  })
                }]
              }
              key={item}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  const majorVersionIOS = parseInt(Platform.Version, 10);
                  console.log('FIN majorVersionIOS', majorVersionIOS)
                }
                // ReactNativeHapticFeedback.trigger('impactLight', options)
                this.setActive(i)
                this.props.handleLetterClick && this.props.handleLetterClick(item)
              }}>
              <Text
                style={
                  [styles.itemText,
                  {
                    ...(this.state.activeIndex === i && {
                      color: '#FFF',
                    })
                  }]
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: p.td(100),
    // backgroundColor: '#999',
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    top: Platform.OS === 'ios' ? p.td(100) : p.td(40),
  },
  item: {
    width: itemHeight,
    height: itemHeight,
    justifyContent: 'center',
  },
  itemText: {
    color: '#333',
    fontSize: p.td(30),
    alignItems: 'center',
    textAlign: 'center',
  },
  flashContainer: {
    position: 'absolute',
    backgroundColor: '#F5F6F7',
    right: p.td(50),
  },
  flashLetterText: {
    color: '#333',
    fontSize: p.td(80),

  },
})

export default SideSelector
