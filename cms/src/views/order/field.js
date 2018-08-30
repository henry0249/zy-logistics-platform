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
  },
  logistics: {
    no: {
      name: '物流单号',
      slot: true,
      readOnly: true,
      width: "100",
    },
    transportation: {
      name: '运输工具(车/船)',
      slot: true,
      readOnly: true,
      width: '200'
    },
    loading: {
      name: '装货量',
      type: 'Number',
      slot: true,
    },
    landed: {
      name: '卸货量',
      type: 'Number',
      slot: true,
    },
    price: {
      name: '运费单价',
      type: 'Number',
      slot: true,
      require: true
    },
    total: {
      name: '运费合计',
      type: 'Number',
      require: true,
      slot: true,
      readOnly: true
    },
    // startAt: {
    //   name: '出发时间',
    //   type: 'Date',
    //   slot: true,
    //   readOnly: true,
    //   width:'150'
    // },
    // finishAt: {
    //   name: '送达时间',
    //   type: 'Date',
    //   slot: true,
    //   readOnly: true,
    //   width:'150'
    // },
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
  },
  logisticsTable: {
    no: {
      name: '物流单号',
      slot: true,
      readOnly: true,
      width: "100",
    },
    transportation: {
      name: '运输工具(车/船)',
      slot: true,
      readOnly: true,
      width: '200'
    },
    loading: {
      name: '装货量',
      type: 'Number',
    },
    landed: {
      name: '卸货量',
      type: 'Number',
    },
    price: {
      name: '运费单价',
      type: 'Number',
    },
    startAt: {
      name: '出发时间',
      type: 'Date',
    },
    finishAt: {
      name: '送达时间',
      type: 'Date',
    },
    state: {
      type: 'String',
      name: '状态',
      slot: true,
      width: "100",
      option: {
        0: '接单',
        1: '待装',
        2: '在途',
        3: '待卸',
        4: '完成'
      }
    }
  }
}
