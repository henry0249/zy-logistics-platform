module.exports = {
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  creater: {
    name: '创建人',
    type: 'ObjectId',
    ref: 'User',
    require: true
  },
  owner: {
    name: '拥有者',
    type: 'ObjectId',
    ref: 'User',
    require: true
  },
  isPlatform: {
    name: '平台标识',
    type: 'Boolean'
  },
  auth: {
    name: '资质认证',
    type: 'Boolean'
  },
  qualification: {
    name: '资质认证材料',
    type: 'Object'
  },
  info: {
    name: '其他信息',
    type: 'Object'
  },
  platform: {
    name: '所属平台',
    type: 'ObjectId'
  },
  admin: {
    name: '管理员',
    type: 'ObjectIdArray',
    ref: 'User',
    require: true
  },
  salesman: {
    name: '业务员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  auditor: {
    name: '审核员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  dispatcher: {
    name: '调度员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  financial: {
    name: '财务员',
    type: 'ObjectIdArray',
    ref: 'User'
  }
}