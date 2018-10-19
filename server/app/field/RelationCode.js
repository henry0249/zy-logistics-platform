module.exports = {
  type: {
    name: '关联类型',
    type: 'String',
    option: {
      common: '通用',
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
  expiration: {
    name: '有效时长',
    type: 'Number',
    default: 7 * 24 * 60 * 60 * 1000 //7天
  },
  company: {
    name: '生成关联代码的公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  relation: {
    name: '使用此代码的公司',
    type: 'ObjectIdArray',
    ref: 'Company'
  }
}