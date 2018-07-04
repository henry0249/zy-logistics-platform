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
  goods: {
    type: 'ObjectId',
    name: '商品信息',
    ref: 'Goods'
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  transportTrains: {
    type: 'ObjectId',
    name: '所属物流链',
    ref: 'TransportTrains'
  },
  origin: {
    type: 'ObjectId',
    name: '出发地',
    ref: 'Area'
  },
  transfer: {
    type: 'ObjectId',
    name: '中转地',
    ref: 'Transfer'
  },
  transfer2: {
    type: 'ObjectId',
    name: '第二中转地',
    ref: 'Transfer'
  },
  destination: {
    type: 'ObjectId',
    name: '目的地',
    ref: 'Area'
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
  carrier: {
    type: 'ObjectId',
    name: '承运商',
    ref: 'Company'
  },
  loading: {
    name: '装货数量',
    type: 'Number',
  },
  landed: {
    name: '卸货数量',
    type: 'Number',
  },
  settlementCount: {
    name: '结算数量',
    type: 'Number',
  },
  transportPrice: {
    name: '运费单价',
    type: 'Number',
    require: true
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
  address: {
    name: '详细地址',
    type: 'String',
  },
  startAt: {
    name: '出发时间',
    type: 'Date',
  },
  finishAt: {
    name: '送达时间',
    type: 'Date'
  },
  balanced: {
    name: '已结算',
    type: 'Boolean'
  },
  balancedNumber: {
    name: '已结算金额',
    type: 'Number'
  },
  invoiced: {
    name: '已开发票',
    type: 'Boolean'
  },
  invoicedNumber: {
    name: '已开票金额',
    type: 'Number'
  }
}