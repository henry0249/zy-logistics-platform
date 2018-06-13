module.exports = {
  no: {
    name: '船号',
    type: 'String',
  },
  type: {
    name: '类型',
    type: 'Array',
    option: {
      0: '小型',
      1: '中型',
      2: '大型'
    }
  },
  name: {
    name: '名称',
    type: 'String',
  },
  owner: {
    name: '司机',
    type: 'ObjectId',
    ref: 'User',
  },
  info:{
    name: '信息',
    type: 'Array',
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