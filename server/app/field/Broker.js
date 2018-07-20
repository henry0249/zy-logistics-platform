module.exports = {
  value: {
    type: 'ObjectId',
    name: '用户详情',
    ref:'User'
  },
  area: {
    name: '所属区域',
    type: 'ObjectId',
    ref: 'Area'
  },
}