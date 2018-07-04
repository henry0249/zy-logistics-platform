let date2no = (val) => {
  let date = new Date();
  if (val) {
    date = new Date(val);
  }
  let unix = date.getTime().toString();
  return '6' + unix.substring(4, unix.length);
}
export default date2no;
