module.exports = {
  no: {
    type: 'String',
    name: '单号',
  },
  state: {
    type: 'Number',
    name: '状态',
    option: {
      0: '发布',
      1: '接单',
      2: '待装',
      3: '在途',
      4: '待卸',
      5: '完成'
    }
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  transportTrains: {
    type: 'ObjectId',
    name: '所属物流链',
    ref: 'TransportTrains'
  },
  transportation: {
    type: 'String',
    name: '交通工具',
    option: {
      truck: '车',
      ship: '船',
    }
  },
  truck: {
    type: 'ObjectId',
    name: '车辆',
    ref: 'Truck'
  },
  ship: {
    type: 'ObjectId',
    name: '船',
    ref: 'Ship'
  },
  loading: {
    name: '装货数量',
    type: 'Number',
  },
  landed: {
    name: '卸货数量',
    type: 'Number',
  },
  price: {
    name: '运费单价',
    type: 'Number',
    require: true,
  },
  user: {
    type: 'ObjectId',
    name: '收货人',
    ref: 'User'
  },
  company: {
    type: 'ObjectId',
    name: '收货公司',
    ref: 'Company'
  },
  contactName: {
    name: '收货人',
    type: 'String',
  },
  contactNumber: {
    name: '收货人联系方式',
    type: 'String',
  },
  area: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Area'
  },
  areaArr: {
    name: '收货地址',
    type: 'Array',
  },
  areaInfo: {
    name: '详细地址',
    type: 'String',
  },
  startAt: {
    name: '出发时间',
    type: 'Date',
  },
  distributionAt: {
    name: '配送时间',
    type: 'Date',
  },
  finishAt: {
    name: '送达时间',
    type: 'Date'
  }
}