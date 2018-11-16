module.exports = {
  type: {
    type: 'String',
    name: '关联类型',
    option: {
      'logistics': '物流单',
      'businessTrains': '贸易单'
    }
  },
  balancedSettlement: {
    name: '用结算款结算金额',
    type: 'Number',
    default: 0
  },
  balancedPrepaid: {
    name: '用预付款结算金额',
    type: 'Number',
    default: 0
  },
  invoiced: {
    name: '已开票金额',
    type: 'Number',
    default: 0
  },
  businessTrains: {
    name: '关联的贸易单', //贸易链中包含了付款方和收款方信息
    type: 'ObjectId',
    ref: 'BusinessTrains'
  },
  logistics: {
    name: '关联的物流单', //物流单付款方为运费承担方,收款方为司机关联的物流公司或司机自己
    type: 'ObjectId',
    ref: 'Logistics'
  },
  accountChange:{
    name: '关联的账单流水', //物流单付款方为运费承担方,收款方为司机关联的物流公司或司机自己
    type: 'ObjectId',
    ref: 'AccountChange'
  },
  invoice: {
    name: '关联的发票', //物流单付款方为运费承担方,收款方为司机关联的物流公司或司机自己
    type: 'ObjectId',
    ref: 'Invoice'
  },
  order: {
    name: '关联的订单', //物流单付款方为运费承担方,收款方为司机关联的物流公司或司机自己
    type: 'ObjectId',
    ref: 'Logistics'
  },
  goods: {
    name: '关联的商品', //物流单付款方为运费承担方,收款方为司机关联的物流公司或司机自己
    type: 'ObjectId',
    ref: 'Goods'
  }
}