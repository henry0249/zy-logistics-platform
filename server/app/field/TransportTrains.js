module.exports = {
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
  origin: {
    type: 'ObjectId',
    name: '出发地',
    ref: 'Area'
  },
  destination: {
    type: 'ObjectId',
    name: '目的地',
    ref: 'Area'
  }
}