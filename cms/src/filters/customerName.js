export default function (row) {
  let res = "-";
  if (row.user) {
    res =  row.user.name || row.user.nick || row.user.mobile;
  }
  if (row.company) {
    res = row.company.nick || row.company.name || row.company.mobile || row.company.tel || row.code;
  }
  return res;
}