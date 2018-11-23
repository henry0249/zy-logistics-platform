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
  load: {
    name: '荷载',
    type: 'Number',
    default: 0
  },
  weight: {
    name: '自重', //kg
    type: 'Number',
    default: 0
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