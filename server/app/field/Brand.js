module.exports = {
  name: {
    type: 'String',
    name: '名称',
    require: true
  },
  tag: {
    type: 'Array',
    name: '标签'
  },
  type: {
    type: 'String',
    name: '类型',
  },
  category: { //  水泥 钢材 河沙卵石 石子 
    name: '分类',
    type: 'ObjectIdArray',
    ref: 'Category'
  },
  cover: {
    type: 'String',
    name: '封面',
  }
}