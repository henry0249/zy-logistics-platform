module.exports = {
  type: {
    name: '公司类型',
    type: 'Array',
    option: {
      common: '客户',
      shipper: '发货厂商',
      logistics: '物流公司',
      pool: '联营商',
      transfer: '中转库',
      distributor: '分销点'
    },
    require: true
  },
  dispatch: {
    name: '调度权限',
    type: 'Boolean'
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
  self: {
    name: '自营',
    type: 'Boolean'
  },
  platform: {
    name: '所属平台',
    type: 'ObjectId',
    ref: 'Platform'
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
  dispatchCheck: {
    name: '调度审核员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  dispatcher: {
    name: '调度专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  finishCheck: {
    name: '完成审核员',
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
  },
  dispatchCompany: {
    name: '调度关联公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  relationCompany: {
    name: '关联公司',
    type: 'ObjectIdArray',
    ref: 'Company'
  }
}