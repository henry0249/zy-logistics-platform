module.exports = {
  type:{
    name: '类型',
    type: 'Array',
  },
  name: {
    name: '名称',
    type: 'String',
  },
  owner:{
    name: '司机',
    type: 'ObjectId',
    ref: 'User',
  },
  company: {
    name: '所属公司',
    type: 'ObjectId',
    ref: 'Company',
  },
  self:{
    name:'自营',
    type:'Boolean'
  }
}