module.exports = {
  type: {
    name: '类型',
    type: 'String',
    require: true
  },
  typeName: {
    name: '类型名称',
    type: 'String',
    require: true
  },
  code: {
    name: '银行英文简称',
    type: 'String',
    require: true
  },
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  no: {
    name: '卡号',
    type: 'String',
    require: true
  },
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  user: {
    name: '所属用户',
    type: 'ObjectId',
    ref: 'Company'
  }
}