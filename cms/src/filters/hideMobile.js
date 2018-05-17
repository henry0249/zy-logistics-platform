let init = (val) => {
  if (val.length === 11) {
    return val.substr(0, 3) + '****' + val.substr(7);
  }
  return val;
}
export default init
