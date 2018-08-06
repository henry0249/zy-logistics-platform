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
    type: 'ObjectIdArray',
    ref: 'Company'
  },
  businessRelationCompany: {
    name: '贸易链关联公司',
    type: 'ObjectIdArray',
    ref: 'Company'
  }
}