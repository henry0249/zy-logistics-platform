module.exports = {
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
  longitude: {
    type: 'String',
    name: '经度'
  },
  latitude: {
    type: 'String',
    name: '纬度'
  }
}