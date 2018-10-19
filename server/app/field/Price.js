module.exports = {
  name: {
    name: '价格表名称',
    type: 'String'
  },
  factory: {
    name: '出厂价',
    type: 'Number'
  },
  sell: {
    name: '销售价',
    type: 'Number'
  },
  transport: {
    name: '运输价',
    type: 'Number'
  },
  brokerBonus: {
    name: '经纪人提成',
    type: 'Number',
  },
  temporaryBrokerBonus: {
    name: '临时经纪人提成',
    type: 'Number',
  },
  goods: {
    name: '所属商品',
    type: 'ObjectId',
    ref: 'Goods'
  },
  area: {
    name: '区域',
    type: 'ObjectId',
    ref: 'Area',
    require: true,
  }
}
//修改后保存记录,做价格曲线