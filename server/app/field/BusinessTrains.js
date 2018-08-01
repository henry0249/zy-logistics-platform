module.exports = {
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
  goods: {
    type: 'ObjectId',
    name: '商品信息',
    ref: 'Goods'
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
  }
}