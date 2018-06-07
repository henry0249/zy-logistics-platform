module.exports = {
  user: {
    name: '访问用户',
    type: 'ObjectId',
    ref: 'User'
  },
  ua: {
    name: '设备信息',
    type: 'String',
  },
  sys: {
    name: '访问系统',
    type: 'String',
  },
  company: {
    name: '公司信息',
    type: 'ObjectId',
    ref: 'Company'
  },
  platform: {
    name: '平台信息',
    type: 'ObjectId',
    ref: 'Platform'
  },
  ip: {
    name: '访问ip',
    type: 'String',
  },
  method: {
    name: '访问方法',
    type: 'String',
  },
  curdType: {
    name: '接口方法',
    type: 'String',
  },
  model: {
    name: '访问表名',
    type: 'String',
  },
  body: {
    name: '请求数据',
    type: 'String',
  }
}