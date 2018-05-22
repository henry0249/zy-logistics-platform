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
    option: {
      0: '未发布',
      1: '已发布',
      2: '已下架',
      3: '缺货中',
    }
  },
  selfDeliverySupport: {
    name: '是否支持自提',
    type: 'Boolean'
  },
  freeDelivery: {
    name: '是否包邮',
    type: 'Boolean'
  },
  mfrs: {
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company',
  },
  company: {
    name: '发布公司',
    type: 'ObjectId',
    ref: 'Company',
  },
  platform: {
    name: '发布平台',
    type: 'ObjectId',
    ref: 'Platform',
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