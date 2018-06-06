import dayjs from 'dayjs'
let dayjsFun = (val) => {
  if (val) {
    return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
  }else{
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }
}
export default dayjsFun
