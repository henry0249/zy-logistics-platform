export default {
  type: {
    user: '用户',
    company: '公司',
    goods: '商品',
    area: '地址',
    truck: '车辆',
    ship: '船只'
  },
  path: {
    user: '/user/find',
    company: '/company/find',
    goods: '/goods/find',
    area: '/area/find',
    truck: '/truck/find',
    ship: '/ship/find'
  },
  thead: {
    user: {
      name: {
        name: '用户名'
      },
      mobile: {
        name: '手机号'
      },
      email: {
        name: '邮箱'
      }
    },
    company: {
      type: {
        slot: true,
        name: '公司类型'
      },
      name: {
        name: '公司名称'
      },
      nick: {
        name: '公司别称'
      }
    },
    goods: {
      name: {
        name: '商品名'
      },
      'brand.name': {
        name: '品牌'
      },
      'category.name': {
        name: '分类'
      },
      'company.name': {
        name: '所属公司'
      }
    },
    area: {
      'province.name': {
        name: '省份'
      },
      'city.name': {
        name: '城市'
      },
      'county.name': {
        name: '区/县'
      },
      name: {
        name: '乡/镇'
      }
    },
    truck: {
      no: {
        name: '车牌号'
      },
      'owner.name': {
        name: '司机'
      },
      'company.name': {
        name: '所属公司'
      }
    },
    ship: {
      no: {
        name: '船号'
      },
      'owner.name': {
        name: '船长'
      },
      'company.name': {
        name: '所属公司'
      }
    }
  }
}
