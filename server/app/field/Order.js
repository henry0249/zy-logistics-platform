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
      transport: '运输中',
      finish: '已完成',
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
  goodsCount: {
    type: 'Number',
    name: '商品数量',
    require: true,
  },
  address: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Address',
    require: true
  },
  paid: {
    name: '实付款',
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

  balance:{
    name:'结算金额',
    type: 'Boolean'
  },

  parent: {
    type: 'ObjectId',
    ref: 'Order'
  },
  lastCompany: {
    type: 'ObjectId',
    name: '上家公司',
    ref: 'Company'
  },
  currentCompany:{
    type: 'ObjectId',
    name: '当前公司',
    ref: 'Company'
  },
  nextCompany: {
    type: 'ObjectId',
    name: '下家公司',
    ref: 'Company'
  },
  purchasePrice: {
    name: '进价',
    type: 'Number',
    require: true
  },
  sellPrice: {
    name: '售价',
    type: 'Number',
    require: true
  },

  transportModel: {
    type: 'Number',
    name: '运输方式',
    option: {
      0: '平台配送', //需要匹配运输价格,内部结算
      1: '客户自提', //不能填运输价格
      2: '平台代送', //需要输入运输价格,用户结算
      3: '商家包邮' // 第三方厂家承担运输价格
    }
  },
  deliveryTime: {
    name: '收货时间',
    type: 'Date'
  },
  finishTime: {
    name: '完成时间',
    type: 'Date'
  },

}