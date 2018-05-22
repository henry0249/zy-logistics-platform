module.exports = {
  name: {
    type: 'String',
    name: '名称',
    require: true
  },
  cover: {
    type: 'String',
    name: '封面',
  },
  desc: {
    type: 'String',
    name: '描述',
  },
  remark: {
    type: 'String',
    name: '备注',
  },
  parent: {
    name: '父级分类',
    type: 'ObjectId',
    ref: 'Category'
  }
}