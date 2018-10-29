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
  type: {
    type: 'Number',
    name: '发票类型',
    option: {
      0: '增值专票',
      1: '增值普票'
    }
  },
  auditor: {
    name: '审核人',
    type: 'ObjectIdArray',
    ref: 'User'
  }
}