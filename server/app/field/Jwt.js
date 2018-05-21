module.exports = {
  user: {
    name: '用户信息',
    type: 'ObjectId',
    ref: 'User'
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
  }
}