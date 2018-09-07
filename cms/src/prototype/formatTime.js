import dayjs from 'dayjs'
let dayjsFun = (val, str = "YYYY-MM-DD HH:mm:ss") => {
  if (val) {
    return dayjs(val).format(str);
  } else {
    return dayjs().format(str);
  }
}
export default dayjsFun
