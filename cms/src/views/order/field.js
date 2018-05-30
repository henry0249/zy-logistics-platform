module.exports = {
  create: {
    // brand: {
    //   name: "品牌",
    //   type: "ObjectId",
    //   readOnly: true
    // },
    goods: {
      name: "商品名称",
      type: "String",
      require: true,
      readOnly: true,
      slot: true,
      width: "300",
    },
    goodsCount: {
      name: "数量"
    },
    unit: {
      name: "单位",
      readOnly: true,
      slot: true,
    },
    sellPrice: {
      name: "销售单价",
      readOnly: true
    },
    transportPrice: {
      name: "运输单价",
      readOnly: true
    },
    totalPrice: {
      name: "合计金额",
      readOnly: true
    }
  },
  taking: {
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
    }
  }
}
