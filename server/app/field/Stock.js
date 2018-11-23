module.exports = {
  no: {
    name: '库存单号',
    type: 'String',
  },
  check: {
    name: '审核标识',
    type: 'Boolean',
    default: false
  },
  checkFail: {
    type: 'String',
    name: '审核未通过状态',
    option: {
      stockAdmin: '仓库管理员审核未通过',
    }
  },
  type: {
    name: '库存变化类型',
    type: 'String',
    option: { in: '入库',
      out: '出库',
      increase: '增益',
      decrease: '损耗',
      check: '盘点',
    }
  },
  name: {
    name: '库存单名称',
    type: 'String',
  },
  goods: {
    name: '商品',
    type: 'ObjectId',
    ref: 'Goods'
  },
  num: {
    name: '数量',
    type: 'Number',
  },
  old: {
    name: '操作前库存',
    type: 'Number',
  },
  new: {
    name: '新库存数量',
    type: 'Number',
  },
  dv: {
    name: '差值',
    type: 'Number',
  },
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  order: {
    name: '所属订单',
    type: 'ObjectId',
    ref: 'Order'
  },
  businessTrains: {
    name: '关联的贸易链',
    type: 'ObjectId',
    ref: 'BusinessTrains'
  },
  transportTrains: {
    name: '关联的物流链',
    type: 'ObjectIdArray',
    ref: 'TransportTrains'
  },
  logistics: {
    name: '关联的物流单',
    type: 'ObjectIdArray',
    ref: 'Logistics'
  },
  toType: {
    name: '去往类型',
    type: 'String',
    option: {
      user: '用户',
      company: '公司'
    }
  },
  toCompany: {
    name: '去往公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  toUser: {
    name: '去往用户',
    type: 'ObjectId',
    ref: 'User'
  }
}