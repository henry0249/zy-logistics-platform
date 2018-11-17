let thead1 = {
  value: {
    name: '金额',
    readOnly: true,
    slot: true
  },
  type: {
    name: '类型',
    slot: true,
    width: 70
  },
  payUser: {
    name: '付款方',
    slot: true
  },
  'to.account': {
    name: '付款卡号',
    readOnly: true
  },
  getUser: {
    name: '收款方',
    slot: true
  },
  'from.account': {
    name: '收款卡号',
    readOnly: true
  },
  remittanceTime: {
    name: '转账日期',
    readOnly: true
  },
  accountingTime: {
    name: '到账日期',
    readOnly: true
  },
};
let thead2 = {
  value: {
    name: '金额',
    slot: true
  },
  taxRate: {
    name: '税率',
    readOnly: true,
    slot: true
  },
  type: {
    name: '发票类型',
    slot: true
  },
  company: {
    name: '开票公司',
    slot: true
  },
  toCompany: {
    name: '收方公司',
    slot: true
  },
  'to.account': {
    name: '付款卡号',
    readOnly: true
  },
  'from.account': {
    name: '收款卡号',
    readOnly: true
  },
};
export default {
  received: {
    thead: thead1,
    title: '查看详情',
    type: 'receive'
  },
  receivedCheck: {
    thead: thead1,
    title: '审核付款流水',
    type: 'receive',
  },
  receivedEditCheck: {
    thead: thead1,
    type: 'receive',
    title: '查看未通过审核付款流水',
    thead: { ...thead1,
      'checkFailData.remark': {
        name: '回退理由',
        readOnly: true,
      }
    },

  },
  invoice: {
    thead: thead2,
    type: 'invoice',
    title: '查看详情'
  },
  invoiceCheck: {
    thead: thead2,
    type: 'invoice',
    title: '审核开票记录'
  },
  invoiceEditCheck: {
    thead: { ...thead2,
      'checkFailData.remark': {
        name: '回退理由',
        readOnly: true,
      }
    },
    type: 'invoice',
    title: '查看未通过审核开票记录'
  },
}
