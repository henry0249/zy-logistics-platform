module.exports = {
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
      width: '180'
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
    balancePrice: {
      name: '结算价格',
      slot: true
    },
    balanceCount: {
      name: '结算数量',
      slot: true
    },
    balanceCompany: {
      name: '运费承担方',
      slot: true,
      width: 150
    },
    loss: {
      name: '损耗数量',
      slot: true
    },
    lossCompany: {
      name: '损耗承担方',
      slot: true,
      width: 150
    },
    // total: {
    //   name: '运费合计',
    //   type: 'Number',
    //   require: true,
    //   slot: true,
    //   readOnly: true
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
      width: "110",
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
    },
    startAt: {
      name: '出发时间',
      type: 'Date',
      slot: true,
      width: "200"
    },
    finishAt: {
      name: '送达时间',
      type: 'Date',
      slot: true,
      width: "200"
    },
    total: {
      name: '运费合计',
      type: 'Number',
      require: true,
      slot: true,
      readOnly: true
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
