module.exports = {
  settleState: {
    type: 'String',
    name: '结算状态',
    option: {
      financial: '待预审',
      settle: '待结算',
      financialManager: '待审核',
      settleFinish: '结算完成',
      invoiceFinish: '开票完成',
    }
  },
  settleStateCheckFail: {
    type: 'String',
    name: '结算审核未通过状态',
    option: {
      settle: '结算专员审核未通过',
      financialManager: '财务经理审核未通过',
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
  customerType: {
    type: 'String',
    name: '客户类型',
    option: {
      user: '用户',
      company: '公司'
    }
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
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  balanceType: {
    name: '付款方类型',
    type: 'String',
    option: {
      user: '用户',
      company: '公司',
    },
    default: 'company'
  },
  balanceUser: {
    name: '付款人',
    type: 'ObjectId',
    ref: 'User'
  },
  balanceCompany: {
    name: '付款公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  receivedType: {
    name: '收款方类型',
    type: 'String',
    option: {
      company: '公司',
      user: '用户',
    },
    default: 'company'
  },
  receivedCompany: {
    type: 'ObjectId',
    name: '收款公司',
    ref: 'Company'
  },
  receivedUser: {
    type: 'ObjectId',
    name: '收款人',
    ref: 'User'
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
  preBalancePrice: {
    name: '贸易单价', //预审时填写的是结算价格,贸易链节点填写的是贸易单价,用来做预审结算价格对比
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
  preSettlement: {
    name: '用结算款结算金额', //仅做记录
    type: 'Number',
    default: 0
  },
  prePrepaid: {
    name: '用预付款结算金额', //仅做记录
    type: 'Number',
    default: 0
  },
  balancedSettlement: {
    name: '已用结算款结算金额', //真实记录
    type: 'Number',
    default: 0
  },
  balancedPrepaid: {
    name: '已用预付款结算金额', //真实记录
    type: 'Number',
    default: 0
  },
  preInvoiced: {
    name: '等待开票金额', //仅做记录
    type: 'Number',
    default: 0
  },
  invoiced: {
    name: '已开票金额',
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
  },
  account: {
    name: '关联的账户',
    type: 'ObjectId',
    ref: 'Account'
  },
  last: {
    name: '上一个贸易节点',
    type: 'ObjectId',
    ref: 'BusinessTrains'
  },
  next: {
    name: '下一个贸易节点',
    type: 'ObjectId',
    ref: 'BusinessTrains'
  }
}