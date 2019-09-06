// 轮询
const Polling = (callBack, onFail, duration, maxTime) => {
  const i = setInterval(() => {
    maxTime--
    if (!maxTime) {
      clearInterval(i)
      onFail && onFail()
    }
    callBack()
  }, duration * 1000)

  return () => {
    console.log('FIN Clear Interrval I', i)
    clearInterval(i);
  }
}

export default Polling
