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
  mfrs: {
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company',
  },
  associate: {
    name: '联营商',
    type: 'ObjectId',
    ref: 'Company',
  },
  associate2: {
    name: '第二联营商',
    type: 'ObjectId',
    ref: 'Company',
  },
  user: {
    name: '收货人',
    type: 'ObjectId',
    ref: 'User'
  },
  company: {
    name: '收货公司',
    type: 'ObjectId',
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
  balanced: {
    name: '已结算',
    type: 'Boolean'
  },
  balancedNumber: {
    name: '已结算金额',
    type: 'Number'
  },
  invoiced: {
    name: '已开发票',
    type: 'Boolean'
  },
  invoicedNumber: {
    name: '已开票金额',
    type: 'Number'
  },
}