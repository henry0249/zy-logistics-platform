module.exports = {
  customerName: function (row) {
    let res = "-";
    if (row.user) {
      res = row.user.name || row.user.nick || row.user.mobile;
    }
    if (row.company) {
      res = row.company.nick || row.company.name || row.company.mobile || row.company.tel || row.code;
    }
    return res;
  },
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
  businessTrains: {
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
      require: true,
      readOnly: true
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
