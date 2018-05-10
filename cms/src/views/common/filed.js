export default [{
  key: 'type',
  keyValue: '用户类型',
  value: '',
  options: [{
    value: '散户',
    label: '散户'
  }, {
    value: '大客户',
    label: '大客户'
  }, {
    value: 'vip',
    label: 'vip'
  }]
}, {
  key: 'company',
  keyValue: '所属公司',
  value: '',
  options: []
}, {
  key: 'role',
  keyValue: '角色',
  value: '',
  options: [{
    value: 'common',
    label: '普通用户'
  },{
    value: 'sys',
    label: '系统管理员'
  },{
    value: 'platform_admin',
    label: '平台管理员'
  },{
    value: 'company_admin',
    label: '公司管理员'
  }]
}]
