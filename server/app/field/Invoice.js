module.exports = {
  check: {
    name: '是否已审核',
    type: 'Boolean',
    default: false
  },
  checkFail: {
    type: 'String',
    name: '审核未通过状态',
    option: {
      financialManager: '财务经理审核未通过',
    }
  },
  value: {
    name: '金额',
    type: 'Number'
  },
  taxRate: {
    type: 'Number',
    name: '税率'
  },
  type: {
    type: 'Number',
    name: '发票类型',
    option: {
      0: '增值专票',
      1: '增值普票'
    }
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
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  company: {
    name: '开票方公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  toMobile: {
    name: '收方手机号', //未注册用户或公司作为关联账单的标识
    type: 'String',
  },
  toCompany: {
    name: '收方公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  toUser: {
    name: '收方用户',
    type: 'ObjectId',
    ref: 'User'
  },
  from: {
    name: '开票信息',
    type: 'Object',
  },
  to: {
    name: '收票方信息',
    type: 'Object',
  },
  businessTrainsArr: {
    name: '关联的贸易链',
    type: 'Array',
  },
  logisticsArr: {
    name: '关联的运单',
    type: 'Array',
  },
  account: {
    name: '所属账户',
    type: 'ObjectId',
    ref: 'Account'
  },
  auditor: {
    name: '审核人',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  contactNumber: {
    name: '联系电话',
    type: 'String',
  },
  address: {
    name: '地址',
    type: 'String',
  },
  billingDate: {
    name: '开票日期',
    type: 'Date',
  },
  isChildren: {
    name: '子发票标识',
    type: 'Boolean'
  },
  children: {
    name: '子发票', //做备份使用
    type: 'ObjectId',
    ref: 'Invoice'
  },
  settleRelation: {
    name: '结算关联', //关联贸易单和物流单
    type: 'ObjectIdArray',
    ref: 'SettleRelation'
  }
}