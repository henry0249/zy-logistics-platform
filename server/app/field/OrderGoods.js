module.exports = {
  value: {
    name: '商品',
    type: 'ObjectId',
    ref: 'Goods'
  },
  count: {
    name: '数量',
    type: 'Number',
  },
  factoryPrice: {
    name: '出厂单价',
    type: 'Number',
  },
  unitPrice: {
    name: '销售单价',
    type: 'Number',
  },
  transportPrice: {
    name: '运输单单价',
    type: 'Number',
  },
  order: {
    name: '所属订单',
    type: 'ObjectId',
    ref: 'Order'
  },
  area: {
    name: '地区',
    type: 'ObjectId',
    ref: 'Area'
  }
}