module.exports = {
  brand: {
    name: '品牌',
    type: 'ObjectId',
    ref: 'Brand'
  },
  category: {
    name: '分类',
    type: 'ObjectId',
    ref: 'Category'
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
  tag: {
    type: 'Array',
    name: '标签'
  },
  saleState: {
    name: '售卖状态',
    type: 'Number',
    default: 0,
    option: [{
      key: 0,
      value: '未上架'
    }, {
      key: 1,
      value: '正常售卖'
    }, {
      key: 2,
      value: '缺货'
    }, {
      key: 3,
      value: '已下架'
    }, {
      key: 4,
      value: '不展示'
    }]
  },
  creater: {
    name: '创建人',
    type: 'ObjectId',
    ref: 'User',
    require: true
  },
  company: {
    name: '发布公司',
    type: 'ObjectId',
    ref: 'Company',
    require: true
  },
  platform: {
    name: '发布平台',
    type: 'ObjectId',
    ref: 'Company',
    require: true
  },
  cover: {
    name: '封面',
    type: 'String'
  },
  desc: {
    name: '描述',
    type: 'String'
  },
  remark: {
    name: '备注',
    type: 'String'
  },
  detail: {
    name: '详情',
    type: 'String'
  }
}