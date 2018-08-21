export default {
  user: {
    name: '用户',
    unit: '个',
    placeholder: '输入用户名',
    searchOption: ['name'],
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
    },
    option:{}
  },
  company: {
    name: '公司',
    unit: '家',
    placeholder: '输入公司全称或者简称',
    searchOption: ['name','nick'],
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
    },
    option:{}
  },
  area: {
    name: '区域',
    unit: '个',
    placeholder: '输入乡/镇',
    searchOption: ['name'],
    thead: {
      'province.name': {
        readOnly: true,
        name: '省份'
      },
      'city.name': {
        readOnly: true,
        name: '市'
      },
      'county.name': {
        readOnly: true,
        name: '县'
      },
      name: {
        readOnly: true,
        name: '乡/镇'
      }
    },
    option: {
      populate: [{
        path: 'province',
      }, {
        path: 'city',
      }, {
        path: 'county',
      }],
      type: 'township'
    }
  }
}
