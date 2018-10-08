//经纪人数据
module.exports = {
  type: {
    name: '类型',
    type: 'String',
    option: {
      admin: '管理员',
      salesman: '业务专员',
      beforeDispatchCheck: '审核员(调度前)',
      dispatcher: '调度专员',
      beforeSettleCheck: '审核员(结算前)',
      financial: '财务文员',
      documentClerk: '单据文员',
      // normalBroker:'经纪人',
      // temporaryBroker:'临时经纪人',
      truck: '货车司机',
      ship: '货船船员',
      sys: '系统管理员',
      sysSalesman: '系统业务员',
      sysDispatcher: '系统调度员',
      broker: '经纪人'
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