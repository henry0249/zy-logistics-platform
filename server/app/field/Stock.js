module.exports = {
  type: {
    name: '库存变化类型',
    type: 'String',
    option: { 
      in: '入库',
      out: '出库',
      check: '盘点',
      increase: '增益',
      decrease: '损耗',
      checkIncrease: '盘点增益',
      checkDecrease: '盘点损耗',
    }
  },
  name: {
    name: '库存单名称',
    type: 'String',
  },
  num: {
    name: '数量',
    type: 'Number',
  },
  company: {
    name: '所属公司',
    type: 'ObjectId'
  }
}