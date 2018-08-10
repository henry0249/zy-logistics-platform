export default {
  user: {
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
    returnName: ['name', 'mobile', 'email'],
    option: ['$or']
  },
  company: {
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
    returnName: ['name', 'nick'],
    option: ['$or'],
    populate: [{
      path: 'area',
      populate: [{
        path: 'province'
      }, {
        path: 'city'
      }, {
        path: 'county'
      }, {
        path: 'township'
      }, {
        path: 'street'
      }]
    }]
  },
  goods: {
    thead: {
      name: {
        readOnly: true,
        name: '商品名'
      },
      'category.name': {
        readOnly: true,
        name: '分类'
      }
    },
    returnName: ['name'],
    option: ['$or', 'mfrs', 'brand'],
    populate: [{
      path: 'category'
    }]
  },
  area: {
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
    returnName: ['name', 'key'],
    option: ['$or', 'province', 'city', 'county'],
    populate: [{
      path: 'province'
    }, {
      path: 'city'
    }, {
      path: 'county'
    }]
  },
  truck: {
    thead: {
      no: {
        readOnly: true,
        name: '车牌号'
      },
      'owner.name': {
        readOnly: true,
        name: '司机'
      }
    },
    returnName: ['no'],
    option: ['$or', 'no', 'company', 'type'],
    populate: [{
      path: 'owner'
    }]
  },
  ship: {
    thead: {
      no: {
        readOnly: true,
        name: '船号'
      },
      'owner.name': {
        readOnly: true,
        name: '司机'
      }
    },
    returnName: ['no'],
    option: ['$or', 'no', 'company', 'type'],
    populate: [{
      path: 'owner'
    }]
  }
}
