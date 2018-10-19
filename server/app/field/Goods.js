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
  packingType: {
    name: '包装类型',
    type: 'String',
    option: {
      bag: '袋装',
      bulk: '散装'
    },
    default: 'bag'
  },
  stock: {
    name: '库存',
    type: 'Number',
    default: 0
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
      0: '编辑',
      1: '上架',
      2: '下架',
      3: '缺货',
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
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company',
  },
  manufacturer: {
    name: '生产厂商',
    type: 'ObjectId',
    ref: 'Company',
  },
  cover: {
    name: '封面',
    type: 'String'
  },
  detail: {
    name: '详情',
    type: 'String'
  },
  recommenderBonus: {
    name: '推荐人提成',
    type: 'Number',
    default: 0 // 0 - 100,代表百分比
  }
}
