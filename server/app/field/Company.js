module.exports = {
  type:{
    name: '公司类型',
    type: 'Array',
    require: true,
    option:[{
      key:'logistics',
      value:'物流公司'
    },{
      key:'shipper',
      value:'发货厂商'
    },{
      key:'trading',
      value:'贸易公司'
    }]
  },
  name: {
    name: '名称',
    type: 'String',
    require: true
  },
  auth: {
    name: '资质认证',
    type: 'Boolean'
  },
  qualification: {
    name: '资质认证材料',
    type: 'Object'
  },
  platform: {
    name: '所属平台',
    type: 'ObjectId',
    ref:'Platform'
  },
  setting:{
    name: '设置',
    type: 'Object'
  },
  desc: {
    name: '描述',
    type: 'String'
  },
  remark: {
    name: '备注',
    type: 'String'
  },
  info: {
    name: '其他信息',
    type: 'Object'
  },
  creater: {
    name: '创建人',
    type: 'ObjectId',
    ref: 'User'
  },
  owner: {
    name: '拥有者',
    type: 'ObjectId',
    ref: 'User'
  },
  admin: {
    name: '管理员',
    type: 'ObjectIdArray',
    ref: 'User',
    require: true
  },
  salesman: {
    name: '业务专员',
    type: 'ObjectIdArray',
    ref: 'User'
  },
  financial: {
    name: '财务文员',
    type: 'ObjectIdArray',
    ref: 'User'
  }
}
// ajax.post('/company/findOne',{
//   isPlatform:true,
//   admin:{
//     $in:[this.user._id]
//   }
// })
// ajax.post('/company/findOne',{
//   isPlatform:true,
// })
// ajax.post('/user/find',{
//   isSys:true,
// })
// ajax.post('/user/find',{
//   role:{
//     $in:['sys']
//   },
// })
