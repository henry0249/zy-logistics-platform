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
  checkFail: {
    type: 'String',
    name: '审核未通过状态',
    option: {
      financialManager: '财务经理审核未通过',
    },
    default: ""
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
  toType: {
    name: '收票方类型',
    type: 'String',
    option: {
      user: '个人',
      company: '公司',
      mobile: '手机号' //未注册用户
    }
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
  auditor: {
    name: '审核人',
    type: 'ObjectId',
    ref: 'User'
  },
  remittanceTime: {
    name: '汇款时间',
    type: 'String'
  },
  accountingTime: {
    name: '到账时间',
    type: 'String'
  },
  isChildren: {
    name: '是否是子账单',
    type: 'Boolean'
  },
  children: {
    name: '子账单', //做备份使用
    type: 'ObjectId',
    ref: 'AccountChange'
  },
  settleRelation: {
    name: '结算关联', //关联贸易单和物流单
    type: 'ObjectIdArray',
    ref: 'SettleRelation'
  }
}