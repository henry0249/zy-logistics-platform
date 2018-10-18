module.exports = {
  type: {
    name: '关联类型',
    type: 'String',
    option: {
      business: '贸易关联',
      transport: '物流关联',
      account: '账户关联'
    }
  },
  name: {
    name: '关联代码',
    type: 'String'
  },
  value: {
    name: '代码值',
    type: 'String'
  },
  expirationAt: {
    name: '有效期至',
    type: 'Date'
  }
}