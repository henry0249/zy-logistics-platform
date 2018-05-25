module.exports = {
  create:{
    brand: {
      name: "品牌",
      type: "ObjectId"
    },
    name: {
      name: "名称",
      type: "String",
      require: true
    },
    unit: {
      name: "单位",
      type: "String",
      require: true
    },
    goodsCount: {
      name: "数量"
    },
    sellPrice: {
      name: "销售单价"
    },
    transportPrice: {
      name: "运输单价"
    },
    totalPrice: {
      name: "合计金额"
    }
  },
  taking:{
    _id: {
      type: 'ObjectId',
      name: '订单号'
    },
    author: {
      type: 'ObjectId',
      name: '客户名称',
      ref: 'User'
    },
    goods: {
      type: 'Array',
      name: '商品信息',
    },
    'address.name': {
      type: 'String',
      name: '收货地址'
    },
    deposit: {
      type: Number,
      name: '定金'
    },
    remark: {
      type: 'String',
      name: '备注',
    },
  }
}
