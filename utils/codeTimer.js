const to = async (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};

const codeTimer = (change, done, time) => {
  //for(let i = 0; i < time; i++){
  //change(time - i);
  //await to(1000);
  //}
  //done();
  const i = setInterval(() => {
    change(time--);
  }, 1000);

  const t = setTimeout(() => {
    done();
    clearInterval(i);
  }, time * 1000);

  return () => {
    clearTimeout(t)
    clearInterval(i);
  }
  //await to(time * 1000);
  // clearInterval(i);
  // done();
}

export default codeTimer
