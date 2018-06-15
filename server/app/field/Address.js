module.exports = {
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
  default: {
    name: '默认',
    type: 'Boolean'
  },
  name: {
    name: '详情',
    type: 'String'
  },
  area: {
    name: '区域',
    type: 'ObjectId',
    ref: 'Area'
  },
  contactName: {
    type: 'String',
    name: '联系人',
  },
  contactMobile: {
    type: 'String',
    name: '联系号码'
  }
}