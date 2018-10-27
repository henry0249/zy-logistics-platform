export default {
  name:{
    user:'用户',
    company:'公司'
  },
  path:{
    user:'/user/find',
    company:'/company/find'
  },
  thead:{
    company:{
      name: {
        readOnly: true,
        name: '公司名称'
      },
      nick: {
        readOnly: true,
        name: '公司别称'
      },
      type: {
        readOnly: true,
        slot: true,
        name: '公司类型'
      }
    },
    user:{
      name: {
        readOnly: true,
        name: '用户名'
      },
      mobile:{
        readOnly: true,
        name: '手机号码'
      },
      company: {
        readOnly: true,
        slot: true,
        name: '关联主公司'
      }
    }
  }
}
