module.exports = {
  type: {
    type: 'String',
    name: '类型',
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
    }
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
    name: '经过公司',
    ref: 'Company'
  },
  user: {
    type: 'ObjectId',
    name: '收货客户',
    ref: 'User'
  },
  sort: {
    type: 'Number',
    name: '排序',
  }
}