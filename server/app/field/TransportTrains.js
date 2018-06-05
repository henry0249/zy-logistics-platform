module.exports = {
  area: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Area'
  },
  goods:{
    type: 'ObjectId',
    name: '商品信息',
    ref: 'Goods'
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  lastCompany: {
    type: 'ObjectId',
    name: '上家公司',
    ref: 'Company'
  },
  currentCompany: {
    type: 'ObjectId',
    name: '当前公司',
    ref: 'Company'
  },
  nextCompany: {
    type: 'ObjectId',
    name: '下家公司',
    ref: 'Company'
  },
  purchaseCount: {
    name: '进货数量',
    type: 'Number',
    require: true
  },
  purchasePrice: {
    name: '进价',
    type: 'Number',
    require: true
  },
  sellCount: {
    name: '出货数量',
    type: 'Number',
    require: true
  },
  sellPrice: {
    name: '售价',
    type: 'Number',
    require: true
  },
}