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
