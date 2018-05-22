module.exports = {
  state: {
    type: 'String',
    name: '状态',
    option: {
      taking: '待接单',
      check: '待审核',
      distribution: '待配货',
      dispatch: '待调度',
      settlement: '待结算',
      delete: '已删除'
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
    type: 'ObjectId',
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
  selfDelivery: {
    name: '是否自提',
    type: 'Boolean'
  },
  freeDelivery: {
    name: '是否包邮',
    type: 'Boolean'
  },
  transportModel: {
    type: 'Number',
    name: '运输方式',
    default: 0,
    option: {
      0: '平台配送', //需要匹配运输价格,内部结算
      1: '客户自提', //不能填运输价格
      2: '平台代送', //需要输入运输价格,用户结算
      3: '商家包邮' // 第三方厂家承担运输价格
    }
  },
  expectedDeliveryTime: {
    name: '期望收货时间',
    type: 'Date'
  },
  deliveryTime: {
    name: '收货时间',
    type: 'Date'
  },
  finishTime: {
    name: '完成时间',
    type: 'Date'
  },
  mfrs: {
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