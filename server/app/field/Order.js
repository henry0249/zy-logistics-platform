module.exports = {
  state: {
    type: 'String',
    name: '状态',
    option: {
      taking: '待接单',
      dispatch: '待调度',
      distribution: '待配送',
      transport: '运输中',
      check: '待审核',
      finish: '订单完成',
      delete: '已删除'
    },
    default: 'taking'
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
  creater: {
    type: 'ObjectId',
    name: '创建人',
    ref: 'User'
  },
  name: {
    type: 'String',
    name: '名称'
  },
  area: {
    name: '收货地址',
    type: 'ObjectId',
    ref: 'Area'
  },
  address: {
    name: '详细地址',
    type: 'String',
  },
  contactName: {
    name: '收货人',
    type: 'String',
  },
  contactNumber: {
    name: '收货人联系方式',
    type: 'String',
  },

  paid: {
    name: '实付款',
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
    name: '客户选择自提',
    type: 'Boolean'
  },

  freeDelivery: {
    name: '客户选择包邮',
    type: 'Boolean'
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

  settlementMethod: {
    type: 'Number',
    name: '结算方式',
    option: {
      0: '先款后货',
      1: '先货后款',
      2: '平台垫付',
      3: '预付定金',
      4: '活动搭赠'
    }
  },

  transportModel: {
    type: 'Number',
    name: '运输方式',
    option: {
      0: '平台配送',
      1: '委托配送',
      2: '商家配送',
      3: '客户自提',
    },
    optionDesc: {
      0: '自营商品，平台公司结算运费给物流商',
      1: '第三方商家，商家结算运费给物流商',
      2: '无需填运费信息，无需结算运费',
      3: '无需填运费信息，无需结算运费'
    },
    desc: '运费结算:填写运费信息，运费累加到客户订单金额，平台公司结算运费给物流商'
  },

  invoiceType: {
    type: 'Number',
    name: '发票类型',
    option: {
      0: '增值专票',
      1: '增值普票'
    }
  },
  deliveryTime: {
    name: '配送时间',
    type: 'Date'
  },
  finishTime: {
    name: '完成时间',
    type: 'Date'
  },

  salesman: {
    name: '市场专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  dispatcher: {
    name: '调度员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  documentClerk: {
    name: '单据文员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  financial: {
    name: '财务专员',
    type: 'ObjectIdArray',
    ref: 'User'
  }
}