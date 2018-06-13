module.exports = {
  goods: {
    goods: {
      name: "商品",
      type: "String",
      require: true,
      readOnly: true,
      slot: true,
      width: "300",
    },
    count: {
      name: "数量",
      require: true,
    },
    unit: {
      name: "单位",
      readOnly: true,
    },
    factoryPrice: {
      name: "出厂单价",
    },
    unitPrice: {
      name: "销售单价",
    },
    transportPrice: {
      name: "运输单价",
    },
    totalPrice: {
      name: "合计金额",
      readOnly: true,
      slot: true,
    }
  },
  taking: {
    _id: {
      type: 'ObjectId',
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
    },
    remark: {
      type: 'String',
      name: '备注',
    }
  },
  businessTrains: {
    lastCompany: {
      type: 'ObjectId',
      name: '上家公司',
      ref: 'Company',
      readOnly: true
    },
    currentCompany: {
      type: 'ObjectId',
      name: '联营商',
      ref: 'Company',
      readOnly: true
    },
    purchasePrice: {
      name: '进价',
      type: 'Number',
      require: true
    },
    purchaseCount: {
      name: '进货数量',
      type: 'Number',
      require: true
    },
    sellPrice: {
      name: '售价',
      type: 'Number',
      require: true
    },
    sellCount: {
      name: '出货数量',
      type: 'Number',
      require: true
    },

    totalPrice: {
      name: '结算金额',
      type: 'Number',
      require: true
    }
  },
  logistics: {
    transport: {
      name: '车/船',
      slot:true
    },
    stockOutCount: {
      name: '出库数量',
      type: 'Number',
      require: true
    },
    receiptCount: {
      name: '收货数量',
      type: 'Number',
      require: true
    },
    unitPrice: {
      name: '运费单价',
      type: 'Number',
      require: true
    },
    startAt: {
      name: '出发时间',
      type: 'Date',
    },
    finishAt: {
      name: '送达时间',
      type: 'Date'
    },
    state: {
      type: 'String',
      name: '状态',
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
