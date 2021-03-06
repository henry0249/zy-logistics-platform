module.exports = {
  table: {
    no: {
      name: '订单号',
      width: "110",
      slot: true,
    },
    customer: {
      type: 'ObjectId',
      name: '客户名称',
      slot: true,
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
      width: 300
    },
    remark: {
      type: 'String',
      name: '备注',
      width: 150
    }
  },
  orderGoods: {
    value: {
      name: "商品",
      type: "String",
      require: true,
      readOnly: true,
      slot: true,
      width: 200
    },
    brand: {
      name: "品牌",
      readOnly: true,
      slot: true,
    },
    stock: {
      name: "库存数量",
      slot: true,
    },
    unit: {
      name: "单位",
      readOnly: true,
      slot: true,
    },
    count: {
      name: "数量",
      require: true,
      slot: true,
    },
    factoryPrice: {
      name: "出厂单价",
      slot: true,
    },
    unitPrice: {
      name: "销售单价",
      slot: true,
    },
    // transportPrice: {
    //   name: "运输单价",
    //   slot: true,
    // },
    totalPrice: {
      name: "合计金额",
      readOnly: true,
      slot: true,
    }
  },
  businessTrains: {
    stock: {
      name: "库存"
    },
    purchasePrice: {
      name: '进价',
      type: 'Number',
      require: true,
      slot: true
    },
    purchaseCount: {
      name: '进货数量',
      type: 'Number',
      require: true,
      slot: true,
    },
    sellPrice: {
      name: '售价',
      type: 'Number',
      require: true,
      slot: true,
    },
    sellCount: {
      name: '出货数量',
      type: 'Number',
      require: true,
      slot: true,
    },
    remark: {
      name: '备注',
      type: 'String',
      slot: true,
      require: true
    }
  }
}
