module.exports = {
  state: {
    type: 'String',
    name: '状态',
    option: {
      taking: '待接单',
      check: '待审核',
      distribution: '待配货',
      dispatch: '待调度',
      settlement: '待结算'
    }
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
    name: '名称'
  },
  goods: {
    type: 'Array',
    name: '商品名称',
    require: true,
  },
  address: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Address',
    require: true
  },
  amount: {
    name: '金额',
    type: 'Number'
  },
  payable: {
    name: '应付款',
    type: 'Number'
  },
  paid: {
    name: '已付款',
    type: 'Number'
  },
  deposit: {
    name: '定金',
    type: 'Number'
  },
  paymentModel: {
    name: '付款方式',
    type: 'String',
    option: {
      cash: '现金',
      check: '支票',
      bankTransfer: '银行转账',
      alipay: '支付宝',
      wechatPay: '微信支付'
    }
  },
  transportModel: {
    type: 'Number',
    name: '运输方式',
    default: 0,
    option: {
      0: '包邮', //需要匹配运输价格,内部结算
    }
  },
  expectedDeliveryTime: {
    name: '期望收货时间',
    type: 'Date'
  },
  producer: {
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company',
  },
  pool: {
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
  }
}