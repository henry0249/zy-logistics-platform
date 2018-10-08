module.exports = {
  customerType: {
    type: 'String',
    name: '订单类型',
    default: 'company',
    option: {
      user: '个人订单',
      company: '公司订单'
    }
  },
  type: {
    type: 'String',
    name: '类型',
    option: {
      supplier: '源头供货商',
      pool: '联营商',
      customer: '客户'
    }
  },
  check: {
    type: 'Boolean',
    name: '审核标识',
    default: false
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  user: {
    type: 'ObjectId',
    name: '用户',
    ref: 'User'
  },
  company: {
    type: 'ObjectId',
    name: '公司',
    ref: 'Company'
  },
  supplyPrice: {
    name: '供货价格',
    type: 'Number',
    default: 0
  },
  supplyCount: {
    name: '供货数量',
    type: 'Number',
    default: 0
  },
  receive: {
    name: '实收数量',
    type: 'Number',
    default: 0
  },
  loss: {
    name: '损耗数量',
    type: 'Number',
    default: 0
  },
  lossCompany: {
    name: '损耗承担方',
    type: 'Number',
    default: 0
  },
  balancePrice: {
    name: '结算价格',
    type: 'Number',
    default: 0
  },
  balanceCount: {
    name: '结算数量',
    type: 'Number',
    default: 0
  },
  stock: {
    name: '关联的库存单',
    type: 'ObjectId',
    ref: 'Stock'
  },
  transportTrains: {
    name: '关联的物流链',
    type: 'ObjectId',
    ref: 'TransportTrains'
  },
  logistics: {
    name: '关联的运单',
    type: 'ObjectIdArray',
    ref: 'Logistics'
  }
}