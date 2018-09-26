module.exports = {
  table: {
    no: {
      name: '订单号',
      width: "100",
      slot: true,
    },
    customer: {
      type: 'ObjectId',
      name: '客户名称',
      slot: true,
      width: 150
    },
    goodsName: {
      type: 'String',
      name: '商品名称',
      slot: true,
    },
    goodsCount: {
      type: 'Number',
      name: '商品数量',
      slot: true,
    },
    area: {
      type: 'String',
      name: '收货地址',
      slot: true,
      width: 250
    },
    remark: {
      type: 'String',
      name: '备注',
      // width: 150
    },
    balancePrice: {
      type: 'String',
      name: '结算金额',
      slot: true,
      width: 100
    },
    balanceCount: {
      type: 'String',
      name: '结算数量',
      slot: true,
      width: 100
    },
  }
}
