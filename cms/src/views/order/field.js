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
    transportPrice: {
      name: "运输单价",
      slot: true,
    },
    totalPrice: {
      name: "合计金额",
      readOnly: true,
      slot: true,
    }
  },
  businessTrains: {
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
  },
  logistics: {
    no: {
      name: '运单号',
      slot: true,
      readOnly: true,
      width: "100",
    },
    ts: {
      name: '车/船',
      slot: true,
      width: "120",
      readOnly: true
    },
    loading: {
      name: '装货量',
      type: 'Number',
      width: "70",
    },
    landed: {
      name: '卸货量',
      type: 'Number',
      width: "70",
    },
    transportPrice: {
      name: '运费单价',
      type: 'Number',
      width: "80",
      require: true
    },
    startAt: {
      name: '出发时间',
      type: 'Date',
      slot: true,
      readOnly: true
    },
    finishAt: {
      name: '送达时间',
      type: 'Date',
      slot: true,
      readOnly: true
    },
    state: {
      type: 'String',
      name: '状态',
      slot: true,
      readOnly: true,
      width: "100",
      option: {
        0: '接单',
        1: '待装',
        2: '在途',
        3: '待卸',
        4: '完成'
      }
    },
  }
}
