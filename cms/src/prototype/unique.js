let unique = (arr, key) => {
  if (!(arr instanceof Array)) return [];
  const res = new Map();
  return arr.filter((a) => !res.has(a[key]) && res.set(a[key], 1));
}
export default unique
