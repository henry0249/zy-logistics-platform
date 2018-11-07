const sysPower = {
  role: 'sys',
  model: ['...ctx.model'],
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  curdType: ['add', 'set', 'update', 'find', 'findOne', 'findById', 'delete']
}

module.exports = {
  role: {
    type: 'String',
    name: '角色'
  },
  model: {
    type: 'Object',
    name: '可访问的表'
  }, //哪些表可以被访问
  method: {
    type: 'Array',
    name: '可使用的请求方法'
  }, //get post delete put
  curdType: {
    type: 'Array',
    name: '可使用的接口方法'
  }, // 可以使用哪些方法 'add', 'set', 'update', 'find', 'findOne', 'findById', 'delete'
  user: {
    type: 'ObjectId',
    name: '属于哪个用户',
    ref: 'User'
  }
}