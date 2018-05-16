import is from 'is_js';
let isFilter = (val, funName, all) => {
  if (all) {
    return is.all[funName](val);
  }else{
    return is[funName](val);
  }
}
export default isFilter
