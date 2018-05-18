module.exports = {
  value:{
    name: '价格',
    type: 'Number',
    require: true
  },
  name: {
    name: '价格表',
    type: 'String'
  },
  area: {
    name: '地区',
    type: 'ObjectId',
    ref: 'Area'
  },
  parent: {
    name: '父级',
    type: 'ObjectId',
    ref: 'Price'
  },
  desc: {
    type: 'String',
    name: '描述'
  },
  remark: {
    type: 'String',
    name: '备注'
  }
}