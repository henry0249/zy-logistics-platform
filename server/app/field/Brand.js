module.exports = {
  name: {
    type: 'String',
    name: '名称',
    require: true
  },
  tag:{
    type: 'Array',
    name: '标签'
  },
  type:{
    type: 'String',
    name: '类型',
  },
  cover:{
    type: 'String',
    name: '封面',
  },
  desc:{
    type: 'String',
    name: '描述',
  },
  remark:{
    type: 'String',
    name: '备注',
  },
  creater:{
    name: '创建人',
    type: 'ObjectId',
    ref: 'User',
  }
}