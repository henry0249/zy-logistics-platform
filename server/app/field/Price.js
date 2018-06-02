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
  area: {
    name: '区域',
    type: 'ObjectId',
    ref: 'Area'
  }
}