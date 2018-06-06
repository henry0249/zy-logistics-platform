import dayjs from 'dayjs'
let dayjsFun = (val) => {
  if (val) {
    return dayjs(val);
  }else{
    return dayjs();
  }
}
export default dayjsFun
