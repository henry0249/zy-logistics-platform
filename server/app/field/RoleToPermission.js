module.exports = {
  role: {
    type: 'ObjectId',
    name: '角色_id',
    ref: 'Role'
  },
  permission: {
    type: 'ObjectId',
    name: '权限_id'
  }
}