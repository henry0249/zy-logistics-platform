module.exports = {
  type: {
    name: '库存变化类型',
    type: 'String',
    option: { in: '入库',
      out: '出库',
      increase: '增益',
      decrease: '损耗',
      check: '盘点',
      // checkIncrease: '盘点增益',
      // checkDecrease: '盘点损耗',
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
  old: {
    name: '操作前库存',
    type: 'Number',
  },
  new: {
    name: '新库存数量',
    type: 'Number',
  },
  dv: {
    name: '差值',
    type: 'Number',
  },
  company: {
    name: '所属公司',
    type: 'ObjectId'
  }
}