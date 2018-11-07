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
  user: {
    name: '开票方用户',
    type: 'ObjectId',
    ref: 'User'
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
}