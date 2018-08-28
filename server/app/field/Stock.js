module.exports = {
  type: {
    name: '库存变化类型',
    type: 'String',
    option: {
      in: '入库',
      out: '出库',
      check: '盘点'
    }
  },
  name: {
    name: '库存单名称',
    type: 'String',
  },
  num: {
    name: '数量',
    type: 'Number',
  }
}