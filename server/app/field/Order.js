module.exports = {
  state: {
    type: 'Array',
    name: '状态'
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
  name: {
    type: 'String',
    name: '订单名称'
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
  producer:{
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company',
  },
  pool:{
    name: '联营商',
    type: 'Array'
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
  },
  desc: {
    type: 'String',
    name: '描述'
  },
  remark: {
    type: 'String',
    name: '备注'
  }
}