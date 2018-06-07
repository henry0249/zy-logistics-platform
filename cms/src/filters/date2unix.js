let date2unix = (val) => {
  let date = new Date();
  if (val) {
    date = new Date(val);
  }
  return date.getTime();
}
export default date2unix;
