import is from 'is_js';

let json2arr = (object) => {
  if (is.json(object)) {
    let res = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const element = object[key];
        res.push({
          label: element,
          value: isNaN(Number(key))?key:Number(key)
        });
      }
    }
    return res;
  }
}
export default json2arr
