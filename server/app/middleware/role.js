//       salesman: '业务员', //审核修改订单信息
//       salesmanManager: '业务经理', //审核修改订单信息
//       tradeClerk: '贸易文员', //添加物流链
//       dispatcher: '调度专员', //添加物流链,提交配送,确认配送完成
//       dispatcherManager: '调度经理', //审核物流单
//       logisticsClerk: '物流文员', //审核物流单
//       documentClerk: '单据文员', //编辑贸易链和物流链结算相关
//       documentClerkManager: '单据主管', //审核单据文员操作
//       financial: '财务文员', //财务预审 ,按贸易链关系归集结算
//       settle: '结算专员', //打款操作
//       cashier: '出纳专员',
//       invoiceCleck: '发票专员',
//       financialManager: '财务经理', //流水审核
module.exports = {
  '/accoutChange/set': ['cashier'],
  '/accoutChange/add': ['cashier'],
  '/accoutChange/update': ['settle','cashier','financialManager'],
  '/accoutChange/delete': ['cashier','financialManager'],
  '/accoutChange/checkFail': ['financialManager'],
  '/invoice/add': ['invoiceCleck'],
  '/invoice/set': ['invoiceCleck'],
  '/invoice/update': ['invoiceCleck'],
  '/invoice/check': ['financialManager'],
  '/invoice/checkFail': ['financialManager'],
  '/invoice/update': ['invoiceCleck','financialManager'],
  '/invoice/delete': ['invoiceCleck','financialManager'],
}