export const removeArr = (array, item) => {
  const i = array.indexOf(item);
  if (i > -1) {
    array.splice(i, 1);
  }
  return array;
};
