module.exports = {
  type: {
    name: '客户类型',
    type: 'String'
  },
  tag: {
    name: '客户标签',
    type: 'Array', //vip 黑名单
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
  balance: {
    name: '账户余额',
    type: 'Number'
  },
  platform: {
    name: '所属平台',
    type: 'ObjectIdArray',
    ref: 'Platform'
  },
  company: {
    name: '所属公司',
    type: 'ObjectIdArray',
    ref: 'Company'
  },
  role: {
    name: '角色',
    type: 'Array',
    option: {
      common: '普通用户',
      admin: '系统管理员',
      platformAdmin: '平台管理员',
      companyAdmin: '公司管理员',
      truck: '货车司机',
      ship: '货船船员'
    },
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
  isSys: {
    name: '系统管理员标识',
    type: 'Boolean'
  },
  defaultAddress: {
    name: '默认地址',
    type: 'ObjectId',
    ref: 'Address'
  },
  address: {
    name: '收货地址',
    type: 'ObjectIdArray',
    ref: 'Address'
  },
  area: {
    name: '区域',
    type: 'ObjectIdArray',
  }
}