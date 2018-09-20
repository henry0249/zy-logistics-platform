module.exports = {
  user: {
    name: '用户信息',
    type: 'ObjectId',
    ref: 'User'
  },
  sys: {
    name: '登录系统标识',
    type: 'String',
    option: {
      wxUser: '微信公众号用户端',
      wxCompany: '微信公众号公司端',
      wxDriver: '微信司机端',
      cms: '后台管理系统',
      sysCms: '系统管理员后台'
    }
  },
  value: {
    name: 'token值',
    type: 'String'
  },
  ua: {
    name: '当前登录设备信息',
    type: 'Object'
  },
  ualist: {
    name: '历史登录设备信息',
    type: 'Array'
  },
  exp: {
    name: '登录有效时长(毫秒)',
    type: 'Number'
  },
  expAt: {
    name: '过期时间',
    type: 'Date'
  },
  loginAt: {
    name: '最近登录时间',
    type: 'Date'
  },
  logoutAt: {
    name: '注销时间',
    type: 'Date'
  },
  lastAccessAt: {
    name: '最近访问时间',
    type: 'Date'
  },
}