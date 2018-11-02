module.exports = {
  settleState: {
    type: 'String',
    name: '结算状态',
    default: 'financial',
    option: {
      financial: '待预审',
      settle: '待结算',
      financialManager: '待审核',
      finish: '结算完成'
    }
  },
  stateCheckFail: {
    type: 'String',
    name: '结算审核未通过状态',
    option: {
      settle: '结算专员审核未通过',
      financialManager: '财务经理审核未通过',
    },
    default: ""
  },
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
  user: {
    type: 'ObjectId',
    name: '用户',
    ref: 'User'
  },
  company: {
    type: 'ObjectId',
    name: '公司', //当前公司,即是付款公司
    ref: 'Company'
  },
  receivedCompany: {
    type: 'ObjectId',
    name: '收款公司', //当前公司付款去向的公司
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
  balancedArr: {
    name: '已结算金额数组', //一个accountChange的_id对应一个金额,因为一次结算,不一定付完
    type: 'Object'
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
  }
}