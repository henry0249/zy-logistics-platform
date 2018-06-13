module.exports = {
  state: {
    type: 'String',
    name: '状态',
    option: {
      0: '接单',
      1: '待装',
      2: '在途',
      3: '待卸',
      4: '完成'
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
  transfer:{
    type: 'ObjectId',
    name: '中转地',
    ref: 'Transfer'
  },
  transfer2:{
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
  stockOutCount: {
    name: '出库数量',
    type: 'Number',
    require: true
  },
  receiptCount: {
    name: '收货数量',
    type: 'Number',
    require: true
  },
  receiptUser: {
    type: 'ObjectId',
    name: '收货人',
    ref: 'Company'
  },
  receiptCompany: {
    type: 'ObjectId',
    name: '收货公司',
    ref: 'Company'
  },
  unitPrice: {
    name: '运费单价',
    type: 'Number',
    require: true
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