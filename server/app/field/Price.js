module.exports = {
  type: {
    name: '类型',
    type: 'String',
    require: true,
    option: [{
      key: 'factory',
      value: '出厂价'
    }, {
      key: 'sell',
      value: '销售价'
    }, {
      key: 'transport',
      value: '运输价'
    }]
  },
  parent: {
    name: '上次价格',
    type: 'ObjectId',
    ref: 'Price'
  },
  history: {
    name: '历史价格标识',
    type: 'Boolean'
  },
  value: {
    name: '价格',
    type: 'Number',
    require: true
  },
  goods: {
    name: '所属商品',
    type: 'ObjectId',
    ref: 'Goods'
  },
  mfrs: {
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company'
  },
  name: {
    name: '价格表',
    type: 'String'
  },
  address: {
    name: '地区',
    type: 'ObjectId',
    ref: 'Address'
  },
  from: {
    name: '出发地',
    type: 'ObjectId',
    ref: 'Address'
  },
  to: {
    name: '目的地',
    type: 'ObjectId',
    ref: 'Address'
  }
}