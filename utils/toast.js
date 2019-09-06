import Toast from "react-native-root-toast"

const toast = (msg) => {
  return Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: false,
    animation: true,
    hideOnPress: true
  })
}

export default toast
