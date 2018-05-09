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
    type: 'Object',
  },
  remark: {
    name: '备注',
    type: 'String',
  }
}
// ua: String,
//     ip: String,
//     method: String,
//     curdType: String,
//     body: Object,
//     model: String,
//     remark: String,
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User'
//     }