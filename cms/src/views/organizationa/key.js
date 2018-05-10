export default {
  platform: [{
    key: 'name',
    keyValue: '平台名',
    value: '',
    type: 'input'
  }, {
    key: 'admin',
    value:[],
    type: 'arr',
    keyValue: '管理员'
  }, {
    key: 'salesman',
    value:[],
    type: 'arr',
    keyValue: '业务员',
  }, {
    key: 'auditor',
    value:[],
    type: 'arr',
    keyValue: '审核员'
  }, {
    key: 'dispatcher',
    value:[],
    type: 'arr',
    keyValue: '调度员'
  }, {
    key: 'financial',
    value:[],
    type: 'arr',
    keyValue: '财务人员'
  }],
  company: [{
    key: 'platform',
    keyValue: '所属平台',
    value: '',
  }, {
    key: 'name',
    keyValue: '公司名',
    value: '',
    type: 'input'
  }, {
    key: 'admin',
    value: [],
    type: 'arr',
    keyValue: '管理员'
  }, {
    key: 'salesman',
    value: [],
    type: 'arr',
    keyValue: '业务员'
  }, {
    key: 'auditor',
    value: [],
    type: 'arr',
    keyValue: '审核员'
  }, {
    key: 'dispatcher',
    value: [],
    type: 'arr',
    keyValue: '调度员'
  }, {
    key: 'financial',
    value: [],
    type: 'arr',
    keyValue: '财务人员'
  }],
  user: [{
    key: 'name',
    value: '',
    type: 'input',
    keyValue: '用户名'
  }, {
    key: 'mobile',
    value: '',
    type: 'input',
    keyValue: '手机号'
  }, {
    key: 'mobile',
    value: '',
    type: 'input',
    keyValue: '手机号'
  }, {
    key: 'email',
    value: '',
    type: 'input',
    keyValue: '邮箱'
  }, {
    key: 'company',
    value: '',
    keyValue: '所属公司或平台'
  }, {
    key: 'role',
    value: '',
    type: 'select',
    keyValue: '权限',
    options:[{
      value:'common',
      label:'普通用户'
    },{
      value:'sys',
      label:'系统管理员'
    },{
      value:'platform_admin',
      label:'平台管理员'
    },{
      value:'company_admin',
      label:'公司管理员'
    }]
  }]
}
