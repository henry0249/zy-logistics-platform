module.exports = {
  value: {
    name: '金额',
    type: 'Number',
  },
  name: {
    name: '名称',
    type: 'String',
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
  invoiceCompany: {
    name: '开票公司',
    type: 'ObjectId'
  },
  invoice: {
    name: '已开票',
    type: 'Boolean',
    default: false
  },
  order: {
    name: '关联订单',
    type: 'ObjectIdArray'
  }
}