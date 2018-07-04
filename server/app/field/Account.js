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
  }
}