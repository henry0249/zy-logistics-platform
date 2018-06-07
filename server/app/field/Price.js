module.exports = {
  factory: {
    name: '出厂价',
    type: 'Number'
  },
  sell: {
    name: '销售价',
    type: 'Number'
  },
  transport: {
    name: '运输价',
    type: 'Number'
  },
  parent: {
    name: '上次价格',
    type: 'ObjectId',
    ref: 'Price'
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
    name: '价格表名称',
    type: 'String'
  },
  area: {
    name: '区域',
    type: 'ObjectId',
    ref: 'Area',
    require: true,
  }
}