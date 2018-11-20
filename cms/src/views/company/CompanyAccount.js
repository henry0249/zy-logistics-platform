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
    readOnly: true,
    slot: true
  },
  accountingTime: {
    name: '到账日期',
    readOnly: true,
    slot: true
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
  payUser: {
    name: '开票方',
    slot: true
  },
  'to.account': {
    name: '付款卡号',
    readOnly: true
  },
  getUser: {
    name: '收方公司',
    slot: true
  },
  'from.account': {
    name: '收款卡号',
    readOnly: true
  },
};
export default {
  received: {
    thead: thead1,
    title: '付款流水',
    type: 'isReceive',
    subText:'修改',
    operatText: '查看详情',
    postPath:'/accountChange/update',
  },
  receivedCheck: {
    thead: thead1,
    title: '审核付款流水',
    type: 'isReceive',
    operatText: '审核付款流水',
    leftText:'打回流水',
    postPath:'/accountChange/check',
    subText:'审核通过',
  },
  receivedEditCheck: {
    thead: thead1,
    type: 'isReceive',
    title: '未通过审核付款流水',
    leftText:'删除',
    postPath:'/accountChange/update',
    subText:'回退',
    operatText: '查看未通过审核付款流水',
    thead: { ...thead1,
      'checkFailData.remark': {
        name: '回退理由',
        readOnly: true,
      }
    },

  },
  invoice: {
    thead: thead2,
    type: 'isInvoice',
    operatText: '查看详情',
    subText:'修改',
    postPath:'/invoice/update',
    title: '开票记录'
  },
  invoiceCheck: {
    thead: thead2,
    type: 'isInvoice',
    operatText: '审核开票记录',
    title: '审核开票记录',
    leftText:'打回开票',
    postPath:'/invoice/check',
    subText:'审核通过',
  },
  invoiceEditCheck: {
    thead: { ...thead2,
      'checkFailData.remark': {
        name: '回退理由',
        readOnly: true,
      }
    },
    type: 'isInvoice',
    operatText: '查看未通过审核开票记录',
    subText:'回退',
    leftText:'删除',
    postPath:'/invoice/update',
    title: '未通过审核开票记录'
  },
  isReceive: {
    value: 0,
    from: {
      bank: '',
      bankName: '',
      account: '',
      type: '',
      remark: ''
    },
    to: {
      bank: '',
      bankName: '',
      account: '',
      type: '',
      remark: ''
    },
    remittanceTime: '',
    accountingTime: '',
    toCompany: {},
    company: {}
  },
  isInvoice: {
    key: {
      value: 0,
      from: {
        name: "",
        bank: "",
        bankName: "",
        account: "",
        type: "",
        remark: "",
        disabled: true
      },
      to: {
        name: "",
        bank: "",
        bankName: "",
        account: "",
        type: "",
        remark: "",
        disabled: true
      },
      recordDate: "",
      openDate: "",
      toCompany: {},
      company: {},
      type: 0,
      taxRate: 0,
      contactNumber: '',
      address: '',
      billingDate: ''
    }
  }
}
