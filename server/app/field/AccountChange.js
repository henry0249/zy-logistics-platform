module.exports = {
  value: {
    name: '金额',
    type: 'Number'
  },
  type: {
    name: '类型',
    type: 'Number',
    option: {
      0: '充值',
      1: '退款',
      2: '发票'
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
  author: {
    name: '操作人',
    type: 'ObjectId',
    ref: 'User'
  },
  area: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Area'
  },
  address: {
    name: '详细地址',
    type: 'String',
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