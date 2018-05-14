module.exports = {
  type: {
    name: '客户类型',
    type: 'String',
    default: ['散户'] //散户 大客户 vip
  },
  name: {
    name: '用户名',
    type: 'String'
  },
  mobile: {
    name: '手机号',
    type: 'String'
  },
  email: {
    name: '邮箱',
    type: 'String'
  },
  password: {
    name: '密码',
    type: 'String'
  },
  info: {
    name: '其他信息',
    type: 'Object'
  },
  company: {
    name: '所属公司',
    type: 'ObjectIdArray',
    ref: 'Company'
  },
  role: {
    name: '角色',
    type: 'Array',
    default: ['common']
  },
  recommendedByUser: {
    name: '推荐人',
    type: 'ObjectId',
    ref: 'User'
  },
  superior: {
    name: '上级', //多指工作关系中的上级
    type: 'ObjectId',
    ref: 'User'
  },
  parent: {
    name: '父级', //和superior有区别,多指数据上面的上下级关系
    type: 'ObjectId',
    ref: 'User'
  },
  isSys:{
    name:'系统管理员标识',
    type: 'Boolean'
  }
}