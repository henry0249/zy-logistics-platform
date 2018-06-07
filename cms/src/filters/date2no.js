let date2no = (val) => {
  let date = new Date();
  if (val) {
    date = new Date(val);
  }
  let unix = date.getTime().toString();
  return unix.substring(3, unix.length);
}
export default date2no;
