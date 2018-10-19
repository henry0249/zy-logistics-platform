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
  dispatcherManagerCheck: {
    type: 'Boolean',
    name: '调度经理审核通过',
    default: false
  },
  logisticsClerkCheck: {
    type: 'Boolean',
    name: '物流文员审核通过',
    default: false
  },
  checkFail: {
    type: 'String',
    name: '审核未通过状态',
    option: {
      dispatcherManager: '调度经理审核未通过',
      logisticsClerk: '物流文员审核未通过',
    },
    default: ""
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  goods: {
    type: 'ObjectId',
    name: '商品信息',
    ref: 'Goods'
  },
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  transportCompany: {
    name: '归属物流公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  transportTrains: {
    type: 'ObjectId',
    name: '起送点物流链节点',
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
    default: 0
  },
  landed: {
    name: '卸货数量',
    type: 'Number',
    default: 0
  },
  price: {
    name: '运费单价',
    type: 'Number',
    require: true,
    default: 0
  },
  balancePrice: {
    name: '结算价格',
    type: 'Number',
    default: 0
  },
  balanceCount: {
    name: '结算数量',
    type: 'Number',
    default: 0
  },
  balanceCompany: {
    name: '运费承担公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  loss: {
    name: '损耗数量',
    type: 'Number',
    default: 0
  },
  lossCompany: {
    name: '损耗承担公司',
    type: 'ObjectId',
    ref: 'Company'
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
  areaType: {
    type: 'String',
    name: '收货地址类型',
    option: {
      0: '普通地址',
      1: '公司地址',
      // 2: '贸易节点'
    }
  },
  area: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Area'
  },
  areaArr: {
    name: '收货地址', //数组
    type: 'Array',
  },
  areaInfo: {
    name: '收货详细地址', //字符串
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
  },
  stock: {
    name: '关联的库存单',
    type: 'ObjectId',
    ref: 'Stock'
  },
  businessTrains: {
    name: '关联的贸易链',
    type: 'ObjectId',
    ref: 'BusinessTrains'
  }
}

//进入审核条件 运输工具和运输单价都填完整,审核后不能修改