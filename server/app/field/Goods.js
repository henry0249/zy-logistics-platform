module.exports = {
  brand:{
    name: '品牌',
    type: 'ObjectId',
    ref:'Brand'
  },
  category:{
    name: '分类',
    type: 'ObjectId',
    ref:'Category'
  },
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  unit: {
    name: '单位',
    type: 'String',
    require: true
  },
  tag:{
    type: 'Array',
    name: '标签'
  },
  creater:{
    name: '创建人',
    type: 'ObjectId',
    ref: 'User',
  },
  company: {
    name: '发布公司',
    type: 'ObjectId',
    ref: 'Company',
  },
  platform: {
    name: '发布平台',
    type: 'ObjectId',
    ref: 'Company'
  },
  cover:{
    name:'封面',
    type:'String'
  },
  desc:{
    name:'描述',
    type:'String'
  },
  remark:{
    name:'备注',
    type:'String'
  },
  detail:{
    name:'详情',
    type:'String'
  }
}