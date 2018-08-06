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
      0: '生产厂商到客户',
      1: '生产厂商到中转',
      2: '中转到中转',
      3: '中转到客户'
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
  mfrs: {
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company',
  },
  fromCompany: {
    name: '进货公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  toCompany: {
    name: '收货公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  user: {
    type: 'ObjectId',
    name: '下单客户',
    ref: 'User'
  },
  company: {
    type: 'ObjectId',
    name: '下单公司',
    ref: 'Company'
  },
  purchasePrice: {
    name: '进价',
    type: 'Number',
    require: true
  },
  purchaseCount: {
    name: '采购数量',
    type: 'Number',
    require: true
  },
  purchaseBalancedCount: {
    name: '采购结算数量',
    type: 'Number',
    require: true
  },
  sellPrice: {
    name: '售价',
    type: 'Number',
    require: true
  },
  sellCount: {
    name: '销售数量',
    type: 'Number',
    require: true
  },
  sellBalancedCount: {
    name: '采购结算数量',
    type: 'Number',
    require: true
  },
  loss: {
    name: '损耗数量',
    type: 'Number',
  }
}