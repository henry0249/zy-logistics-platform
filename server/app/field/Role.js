//经纪人数据
module.exports = {
  type: {
    name: '类型',
    type: 'String',
    option: {
      admin: '管理员',
      salesman: '业务专员',
      dispatchCheck: '调度审核员',
      dispatcher: '调度专员',
      finishCheck: '完成审核员',
      financial: '财务文员',
      documentClerk: '单据文员',
      // normalBroker:'经纪人',
      // temporaryBroker:'临时经纪人',
      truck: '货车司机',
      ship: '货船船员',
      sys:'系统管理员',
      sysSalesman:'系统业务员',
      sysDispatcher:'系统调度员'
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
  }
}