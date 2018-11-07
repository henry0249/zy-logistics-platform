module.exports = {
  check: {
    name: '是否已审核',
    type: 'Boolean',
    default: false
  },
  value: {
    name: '金额',
    type: 'Number'
  },
  payUserType: {
    name: '付款用户类型',
    type: 'String',
    option: {
      user: '个人',
      company: '公司',
      mobile: '手机号' //未注册用户
    }
  },
  type: {
    name: '类型',
    type: 'Number',
    option: {
      0: '充值',
      1: '付款',
      2: '退款',
      3: '发票',
      4: '预付款'
    }
  },
  from: {
    name: '付款信息',
    type: 'Object',
  },
  to: {
    name: '收款信息',
    type: 'Object',
  },
  account: {
    name: '所属账户',
    type: 'ObjectId',
    ref: 'Account'
  },
  user: {
    name: '付款用户',
    type: 'ObjectId',
    ref: 'User'
  },
  company: {
    name: '付款公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  mobile: {
    name: '付款方手机号', //未注册用户或公司作为关联账单的标识
    type: 'String',
  },
  toCompany: {
    name: '收款公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  toUser: {
    name: '收款人',
    type: 'ObjectId',
    ref: 'User'
  },
  author: {
    name: '操作人',
    type: 'ObjectId',
    ref: 'User'
  },
  handle: {
    name: '操作公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  invoice: {
    type: 'ObjectId',
    name: '发票',
    ref: 'Invoice'
  },
  auditor: {
    name: '审核人',
    type: 'ObjectId',
    ref: 'User'
  },
  accountChange: {
    name: '关联的流水单',
    type: 'ObjectId',
    ref: 'AccountChange'
  },
  businessTrains: {
    name: '关联的贸易链', //贸易链中包含了付款方和收款方信息
    type: 'ObjectIdArray',
    ref: 'BusinessTrains'
  },
  logistics: {
    name: '关联的物流单', //物流单付款方为运费承担方,收款方为司机关联的物流公司或司机自己
    type: 'ObjectIdArray',
    ref: 'Logistics'
  },
  remittanceTime: {
    name: '汇款时间',
    type: 'String'
  },
  accountingTime: {
    name: '到账时间',
    type: 'String'
  },
  parent: {
    name: '父级流水',
    type: 'ObjectId',
    ref: 'AccountChange'
  },
  children: {
    name: '子账单',
    type: 'ObjectId',
    ref: 'AccountChange'
  }
}