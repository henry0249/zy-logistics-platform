module.exports = {
  type: {
    type: 'String',
    name: '日志类型',
    option: {
      default: '默认操作日志',
      orderCheckFail: '订单审核失败记录',
      logisticsCheckFail: '物流单审核失败记录',
      businessTrainsCheckFail: '贸易链审核失败记录',
      accountChangeCheckFail: '账户流水审核失败记录',
      invoiceCheckFail: '发票审核失败记录',
      stockCheckFail: '库存单审核失败记录'
    },
    default: 'default'
  },
  user: {
    name: '操作人',
    type: 'ObjectId',
    ref: 'User'
  },
  company: {
    name: '操作时公司信息',
    type: 'ObjectId',
    ref: 'Company'
  },
  order: {
    name: '关联订单',
    type: 'ObjectId',
    ref: 'Order'
  },
  logistics: {
    name: '关联物流单',
    type: 'ObjectId',
    ref: 'Logistics'
  },
  businessTrains: {
    name: '关联贸易链',
    type: 'ObjectId',
    ref: 'BusinessTrains'
  },
  accountChange: {
    name: '关联的流水',
    type: 'ObjectId',
    ref: 'AccountChange'
  },
  invoice: {
    name: '关联的发票',
    type: 'ObjectId',
    ref: 'Invoice'
  },
  stock: {
    name: '关联的库存单',
    type: 'ObjectId',
    ref: 'Invoice'
  },
  ua: {
    name: '设备信息',
    type: 'String',
  },
  sys: {
    name: '访问系统',
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
    type: 'String',
  }
}