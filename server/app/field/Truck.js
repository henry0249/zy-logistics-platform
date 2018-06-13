module.exports = {
  no: {
    name: '车牌号',
    type: 'String',
  },
  type: {
    name: '类型',
    type: 'Array',
    option: {
      0: '微型',
      1: '小型',
      2: '中型',
      3: '大型',
      4: '轻型',
      5: '重型'
    }
  },
  name: {
    name: '名称',
    type: 'String',
  },
  info:{
    name: '信息',
    type: 'Array',
  },
  owner: {
    name: '司机',
    type: 'ObjectId',
    ref: 'User',
  },
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company',
  },
  self: {
    name: '自营',
    type: 'Boolean'
  }
}