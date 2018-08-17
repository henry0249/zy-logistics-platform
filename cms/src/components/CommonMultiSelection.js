export default {
  user: {
    name: '用户',
    unit: '个',
    thead: {
      name: {
        readOnly: true,
        name: '用户名'
      },
      mobile: {
        readOnly: true,
        name: '手机号'
      },
      email: {
        readOnly: true,
        name: '邮箱'
      }
    }
  },
  company: {
    name: '公司',
    unit: '家',
    thead: {
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
    }
  }
}
