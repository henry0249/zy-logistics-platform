module.exports = {
  type: {
    name: '库存变化类型',
    type: 'String',
    option: {
      0: '入库',
      1: '出库',
      2: '盘点'
    }
  },
  name: {
    name: '出库单名称',
    type: 'String',
  },
  num: {
    name: '数量',
    type: 'Number',
  }
}