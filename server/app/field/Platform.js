module.exports = {
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  setting: {
    name: '设置',
    type: 'Object'
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
    ref: 'User'
  },
  salesman: {
    name: '市场专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  dispatcher: {
    name: '调度专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  financial: {
    name: '财务专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  documentClerk: {
    name: '单据文员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  address: {
    name: '地址',
    type: 'ObjectId',
    ref: 'Address'
  }
}