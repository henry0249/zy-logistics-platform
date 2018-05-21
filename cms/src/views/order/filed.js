module.exports = {
  _id: {
    type: 'ObjectId',
    name: '订单号'
  },
  author: {
    type: 'ObjectId',
    name: '客户名称',
    ref: 'User'
  },
  goods: {
    type: 'Array',
    name: '商品信息',
  },
  'address': {
    type: 'String',
    name: '收货地址'
  },
  deposit: {
    type: Number,
    name: '定金'
  },
  remark: {
    type: 'String',
    name: '备注',
  },
}
