module.exports = {
  _id:{
    type: 'ObjectId',
    name: '订单号'
  },
  user: {
    type: 'ObjectId',
    name: '下单客户',
    ref: 'User'
  },
  company: {
    type: 'ObjectId',
    name: '下单公司',
    ref: 'Company'
  },
  goods: {
    type: 'Array',
    name: '商品名称',
    require: true,
  },
  address: {
    type: 'String',
    name: '收货地址',
    require: true
  },
  recommendedByUser: {
    type: 'ObjectId',
    name: '推荐人',
    ref: 'User'
  },
  recommendedByCompany: {
    type: 'ObjectId',
    name: '推荐公司',
    ref: 'Company'
  }
}