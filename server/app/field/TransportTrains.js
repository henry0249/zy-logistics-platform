module.exports = {
  finish: {
    type: 'Boolean',
    name: '节点运输完成标识',
    default: false
  },
  type: {
    type: 'String',
    name: '当前节点类型',
    option: {
      0: '起运地',
      1: '中转地',
      2: '目的地',
    }
  },
  areaType: {
    type: 'String',
    name: '地址类型',
    option: {
      0: '普通地址',
      1: '公司地址',
      // 2: '贸易节点'
    },
    default: "1"
  },
  area: {
    type: 'ObjectId',
    name: '地址',
    ref: 'Area'
  },
  areaArr: {
    name: '任选地址数组',
    type: 'Array',
  },
  areaInfo: {
    type: 'String',
    name: '地址详情'
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  company: {
    type: 'ObjectId',
    name: '节点公司',
    ref: 'Company'
  },
  user: {
    type: 'ObjectId',
    name: '节点用户',
    ref: 'User'
  },
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  carrierCompany: {
    name: '承运公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  last: {
    name: '上一节点',
    type: 'ObjectId',
    ref: 'TransportTrains'
  },
  next: {
    name: '下一节点',
    type: 'ObjectId',
    ref: 'TransportTrains'
  }
}