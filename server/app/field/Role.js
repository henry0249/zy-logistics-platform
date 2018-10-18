//经纪人数据
module.exports = {
  type: {
    name: '类型',
    type: 'String',
    option: {
      salesman: '业务员', //审核修改订单信息
      salesmanManager: '业务经理', //审核修改订单信息
      tradeClerk: '贸易文员', //添加物流链
      dispatcher: '调度专员', //添加物流链,提交配送,确认配送完成
      dispatcherManager: '调度经理', //审核物流单
      logisticsClerk: '物流文员', //审核物流单
      documentClerk: '单据文员', //编辑贸易链和物流链结算相关
      documentClerkManager: '单据主管', //审核单据文员操作
      financial: '财务文员', //财务预审 ,按贸易链关系归集结算
      settle: '结算专员', //打款操作
      financialManager: '财务经理', //流水审核
      companyAdmin: '公司管理员',
      sysAdmin: '系统管理员',
      sysSalesman: '系统业务员',
      sysDispatcher: '系统调度员',
      broker: '经纪人',
      truck: '货车司机',
      ship: '货船船员',
    }
  },
  user: {
    type: 'ObjectId',
    name: '用户详情',
    ref: 'User'
  },
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  order: {
    name: '所属订单',
    type: 'ObjectId',
    ref: 'Order'
  },
  truck: {
    name: '所属车辆',
    type: 'ObjectId',
    ref: 'Truck'
  },
  ship: {
    name: '所属船只',
    type: 'ObjectId',
    ref: 'Ship'
  },
  area: {
    name: '所属区域',
    type: 'ObjectIdArray',
    ref: 'Area'
  },
}