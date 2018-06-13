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
  sort:{
    type: 'Number',
    name: '排序',
  }
}