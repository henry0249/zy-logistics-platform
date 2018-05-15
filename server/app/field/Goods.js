module.exports = {
  brand:{
    name: '品牌',
    type: 'String',
    require: true
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
  company: {
    name: '发布公司',
    type: 'ObjectId',
    ref: 'Company'
  },
  platform: {
    name: '发布平台',
    type: 'ObjectId',
    ref: 'Company'
  }
}