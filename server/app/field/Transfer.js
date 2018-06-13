module.exports = {
  name: {
    name: '中转地名称',
    type: 'String',
  },
  area: {
    name: '地址',
    type: 'ObjectId',
    ref: 'Area'
  }
}