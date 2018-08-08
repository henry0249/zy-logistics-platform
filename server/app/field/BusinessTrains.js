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
      'supplier': '源头供货商',
      'pool': '联营商',
      'customer': '客户'
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
  },
  supplyCount: {
    name: '供货数量',
    type: 'Number',
  },
  receive: {
    name: '实收数量',
    type: 'Number',
  },
  loss: {
    name: '损耗数量',
    type: 'Number',
  },
  balancePrice:{
    name: '结算价格',
    type: 'Number',
  },
  balanceCount:{
    name: '结算数量',
    type: 'Number',
  }
}