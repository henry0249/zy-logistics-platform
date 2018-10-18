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
      salesman: '业务员审核', //业务员审核
      salesmanManager: '业务经理审核', //业务经理审核
      tradeClerk: '贸易文员审核', //添加贸易链
      dispatcher: '调度专员调度', //添加物流链,提交配送,确认配送完成
      dispatcherManager: '调度经理审核', //审核物流单,调度全部结束后进行一次订单审核
      logisticsClerk: '物流文员审核', //审核物流单,调度全部结束后进行一次订单审核
      documentClerk: '单据文员审核', //添加贸易链,物流链的结算价格,数量等
      documentClerkManager: '单据主管审核', //审核单据文员操作,进入结算环节
      financial: '财务文员预审', //在此状态财务文员能进行批量修改贸易链结算价格,恢复贸易链价格等
      settled: '已结算',
      invoiced: '已开票',
      cancel: '取消',
      delete: '删除'
    },
    default: 'salesman'
  },
  checkFail: {
    type: 'String',
    name: '审核未通过状态',
    option: {
      salesman:'业务员审核未通过',
      salesmanManager: '业务经理审核未通过',
      tradeClerk: '贸易文员审核未通过',
      dispatcher: '调度专员调度未通过',
      dispatcherManager: '调度经理审核未通过',
      logisticsClerk: '物流文员审核未通过',
      documentClerk: '单据文员审核未通过',
      documentClerkManager: '单据主管审核未通过',
      financial: '财务文员预审未通过'
    },
    default: ""
  },
  handle: {
    name: '处理公司',
    type: 'ObjectId',
    ref: 'Company'
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
  brokerTemporary: {
    name: '临时经纪人',
    type: 'ObjectId',
    ref: 'User'
  },
  temporaryBrokerBonus: {
    name: '临时经纪人提成',
    type: 'Number',
  },
  businessTrains: {
    name: '贸易链',
    type: 'ObjectIdArray',
    ref: 'BusinessTrains'
  },
  transportTrains: {
    name: '物流链',
    type: 'ObjectIdArray',
    ref: 'TransportTrains'
  }
}