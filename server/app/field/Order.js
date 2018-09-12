module.exports = {
  type: {
    type: 'String',
    name: '订单类型',
    default: 'company',
    option: {
      user: '个人',
      company: '公司'
    }
  },
  no: {
    type: 'String',
    name: '单号',
  },
  state: {
    type: 'String',
    name: '状态',
    option: {
      taking: '待接单',
      beforeDispatchCheck: '调度前审核',
      dispatch: '待调度',
      distributionFinishCheck: '配送完成审核',
      beforeSettleCheck: '结算前审核',
      //财务结算环节
      financialPretrial:'订单预审',
      accountSettlement:'账户结算',
      accountConfirmation:'账款确认',
      finish: '订单完成',
      delete: '已删除'
    },
    default: 'taking'
  },
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  platform: {
    name: '所属平台',
    type: 'ObjectId',
    ref: 'Platform'
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
    name: '收货区域',
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
  goods: {
    name: '商品',
    type: 'ObjectId',
    ref: 'Goods'
  },
  count: {
    name: '订货数量',
    type: 'Number',
  },
  factory: {
    name: '出厂单价',
    type: 'Number',
  },
  sell: {
    name: '销售单价',
    type: 'Number',
  },
  transport: {
    name: '运输单单价',
    type: 'Number',
  },
  brokerType: {
    name: '经纪人类型',
    type: 'String',
    option: {
      normal: '直接经纪人',
      temporary: '临时经纪人'
    }
  },
  broker: {
    name: '经纪人',
    type: 'ObjectId',
    ref: 'Broker'
  },
  brokerBonus: {
    name: '经纪人提成',
    type: 'Number',
  },
  temporaryBrokerBonus: {
    name: '临时经纪人提成',
    type: 'Number',
  }
}