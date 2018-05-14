module.exports = {
  user: {
    type: 'ObjectId',
    name: '下单客户',
    ref:'User'
  },
  company:{
    type: 'ObjectId',
    name: '下单公司',
    ref:'Company'
  },
  referee:{
    type: 'ObjectId',
    name: '推荐人',
    ref:'User'
  },
  name:{
    type:'String',
    name:'订单名称'
  },
}