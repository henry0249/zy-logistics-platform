module.exports = {
  type:{
    type: 'String',
    name: '类型',
    option: {
      0: '生产厂商到客户',
      1: '生产厂商到中转',
      2: '中转到中转',
      3: '中转到客户'
    }
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
  sort: {
    type: 'Number',
    name: '排序',
  }
}