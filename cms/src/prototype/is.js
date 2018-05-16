import is from 'is_js';
let isFilter = (val, funName) => {
  return is[funName](val);
}
export default isFilter
