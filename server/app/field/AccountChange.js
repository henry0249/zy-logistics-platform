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
  type: {
    name: '类型',
    type: 'Number',
    option: {
      0: '充值',
      1: '扣款',
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
    name: '所属用户',
    type: 'ObjectId',
    ref: 'User'
  },
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  author: {
    name: '操作人',
    type: 'ObjectId',
    ref: 'User'
  },
  invoiceType: {
    type: 'Number',
    name: '发票类型',
    option: {
      0: '增值专票',
      1: '增值普票'
    }
  },
  taxRate: {
    type: 'Number',
    name: '税率'
  },
  auditor: {
    name: '审核人',
    type: 'ObjectIdArray',
    ref: 'User'
  }
}