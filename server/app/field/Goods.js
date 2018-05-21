module.exports = {
  brand: {
    name: '品牌',
    type: 'ObjectId',
    ref: 'Brand'
  },
  category: { //  水泥 钢材 河沙卵石 石子 
    name: '分类',
    type: 'ObjectId',
    ref: 'Category'
  },
  price: {
    name: '价格',
    type: 'ObjectIdArray',
    ref: 'Price',
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
  tag: {
    type: 'Array',
    name: '标签'
  },
  spec: {
    type: 'String',
    name: '规格',
    require: true
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
  company: {
    name: '发布公司',
    type: 'ObjectId',
    ref: 'Company',
    // require: true
  },
  platform: {
    name: '发布平台',
    type: 'ObjectId',
    ref: 'Platform',
    // require: true
  },
  cover: {
    name: '封面',
    type: 'String'
  },
  detail: {
    name: '详情',
    type: 'String'
  }
}