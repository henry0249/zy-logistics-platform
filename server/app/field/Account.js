module.exports = {
  type: {
    name: '账户类型',
    type: 'String',
    option: {
      user: '个人账户',
      company: '公司账户'
    }
  },
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
  relationCompany: {
    name: '关联公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  parent: {
    name: '父级账户',
    type: 'ObjectId',
    ref: 'Account'
  }
}