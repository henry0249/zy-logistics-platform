module.exports = {
  type: {
    name: 'l类型',
    type: 'String',
    option: {
      province: '省',
      city: '市',
      county: '县',
      township: '乡',
      street: '街道'
    },
    require: true
  },
  key: {
    name: '编码',
    type: 'Number',
    require: true
  },
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  province: {
    name: '省',
    type: 'Number'
  },
  city: {
    name: '市',
    type: 'Number'
  },
  county: {
    name: '县',
    type: 'Number'
  },
  township: {
    name: '乡',
    type: 'Number'
  }
}