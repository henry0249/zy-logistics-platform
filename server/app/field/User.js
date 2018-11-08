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
  nick: {
    name: '昵称',
    type: 'String',
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
  address: {
    name: '默认地址',
    type: 'ObjectId',
    ref: 'Address'
  },
  area: {
    name: '所属区域',
    type: 'ObjectIdArray',
    ref: 'Area'
  },
  company: {
    name: '关联主公司',
    type: 'ObjectId',
    ref: 'Company'
  }
}