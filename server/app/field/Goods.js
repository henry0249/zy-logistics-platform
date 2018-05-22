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
    ref: 'Price'
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
      0:'未发布',
      1:'已发布',
      2:'已下架',
      3:'缺货中',
    }
  },
  transportModel: {
    type: 'Number',
    name: '运输方式',
    default: 0,
    option: {
      0: '平台配送', //需要匹配运输价格,内部结算
      1: '客户自提', //不能填运输价格
      2: '平台代送', //需要输入运输价格,用户结算
      3: '商家包邮' // 第三方厂家承担运输价格
    }
  },
  mfrs:{
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