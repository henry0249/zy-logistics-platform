module.exports = {
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  setting:{
    name: '设置',
    type: 'Object'
  },
  desc: {
    name: '描述',
    type: 'String'
  },
  remark: {
    name: '备注',
    type: 'String'
  },
  info: {
    name: '其他信息',
    type: 'Object'
  },
  creater: {
    name: '创建人',
    type: 'ObjectId',
    ref: 'User',
  },
  owner: {
    name: '拥有者',
    type: 'ObjectId',
    ref: 'User'
  },
  admin: {
    name: '管理员',
    type: 'ObjectIdArray',
    ref: 'User',
    require: true
  },
  salesman: {
    name: '市场专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  auditor: {
    name: '审核员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  dispatcher: {
    name: '物流专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  documentClerk:{
    name: '单据文员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  financial: {
    name: '财务专员',
    type: 'ObjectIdArray',
    ref: 'User'
  }
}