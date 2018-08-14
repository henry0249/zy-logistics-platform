module.exports = {
  state: {
    type: 'String',
    name: '状态',
    default: 1,
    option: {
      wait: '等待',
      process: '进度完成',
      finish: '完成',
      success: '成功'
    }
  },
  type: {
    type: 'Number',
    name: '类型',
    default: 1,
    option: {
      0: '起点',
      1: '轨迹点',
      2: '中转点',
      3: '终点'
    }
  },
  order: {
    type: 'ObjectId',
    name: '所属订单',
    ref: 'Order'
  },
  logistics: {
    type: 'ObjectId',
    name: '所属物流单',
    ref: 'Logistics'
  },
  area: {
    type: 'ObjectId',
    name: '地址',
    ref: 'Area'
  },
  areaInfo: {
    type: 'String',
    name: '地址详情'
  },
  title: {
    type: 'String',
    name: '标题'
  },
  addressComponent: {
    type: 'Object',
    name: '地址信息对象'
  },
  sematic_description: {
    type: 'String',
    name: '智能地址提示'
  },
  lng: {
    type: 'String',
    name: '经度'
  },
  lat: {
    type: 'String',
    name: '纬度'
  },
  time: {
    type: 'Date',
    name: '时间'
  },
  author: {
    type: 'ObjectId',
    name: '操作人',
    ref: 'User'
  }
}