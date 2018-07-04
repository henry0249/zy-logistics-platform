module.exports = {
  type: {
    name: '公司类型',
    type: 'Array',
    option: {
      common: '一般公司',
      logistics: '物流公司',
      shipper: '发货厂商',
      trading: '贸易公司',
      associate: '联谊商'
    },
    require: true
  },
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  nick: {
    name: '简称',
    type: 'String',
  },
  code: {
    name: '代码',
    type: 'String',
  },
  mobile: {
    name: '手机号',
    type: 'String'
  },
  tel: {
    name: '固话',
    type: 'String'
  },
  auth: {
    name: '资质认证',
    type: 'Boolean'
  },
  qualification: {
    name: '资质认证材料',
    type: 'Object'
  },
  self: {
    name: '自营',
    type: 'Boolean'
  },
  platform: {
    name: '所属平台',
    type: 'ObjectId',
    ref: 'Platform'
  },
  setting: {
    name: '设置',
    type: 'Object'
  },
  info: {
    name: '其他信息',
    type: 'Object'
  },
  owner: {
    name: '主管理员',
    type: 'ObjectId',
    ref: 'User'
  },
  admin: {
    name: '管理员',
    type: 'ObjectIdArray',
    ref: 'User',
  },
  salesman: {
    name: '业务专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  documentClerk: {
    name: '单据文员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  financial: {
    name: '财务文员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  address: {
    name: '地址',
    type: 'String',
  },
  area: {
    name: '区域',
    type: 'ObjectId',
    ref: 'Area'
  }
}