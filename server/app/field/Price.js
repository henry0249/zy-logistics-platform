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
  isHistory: {
    name: '是否为历史价格',
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
  company: {
    name: '所属厂商',
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
  },
  company: {
    name: '发布公司',
    type: 'ObjectId',
    ref: 'Company',
  },
  platform: {
    name: '发布平台',
    type: 'ObjectId',
    ref: 'Platform',
  }
}