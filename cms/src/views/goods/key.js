let goodsThead = {
  "brand.name": {
    name: '品牌'
  },
  "category.name": {
    name: '分类'
  },
  "name": {
    name: '名称'
  },
  "unit": {
    name: '单位'
  },
  "tag": {
    name: '标签',
    readOnly: true,
    slot:true
  }
}
let populate = [{
  path: 'brand'
}, {
  path: 'category'
}, {
  path: 'platform'
}, {
  path: 'company'
}, {
  path: 'mfrs'
}]
let or = [{
  key: 'name'
}, {
  key: 'category',
  type: 'id'
}, {
  type: 'id',
  key: 'brand',
}, {
  key: 'tag',
  type: 'in'
}]
let addkey = [{
    key: 'brand.name',
    value: null,
    type: 'select',
    keyValue: '品牌',
    options: []
  }, {
    key: 'category.name',
    value: null,
    type: 'select',
    keyValue: '分类',
    options: []
  }, {
    key: 'name',
    value: null,
    type: 'input',
    keyValue: '名字'
  }, {
    key: 'unit',
    value: null,
    type: 'input',
    keyValue: '单位'
  }, {
    key: 'spec',
    value: null,
    type: 'input',
    keyValue: '规格'
  }, {
    key: 'company.name',
    value: null,
    type: 'select',
    keyValue: '发布公司',
    options: []
  }, {
    key: 'platform.name',
    value: null,
    type: 'select',
    keyValue: '发布平台',
    options: []
  }, {
    key: 'mfrs.name',
    value: null,
    type: 'select',
    keyValue: '生产厂商',
    options: []
  }, {
    key: 'saleState',
    value: null,
    type: 'select',
    keyValue: '售卖状态',
    options: [{
      value: 0,
      label: '未发布'
    }, {
      value: 1,
      label: '已发布'
    }, {
      value: 2,
      label: '已下架'
    }, {
      value: 3,
      label: '缺货中'
    }]
  }, {
    key: 'selfDeliverySupport',
    keyValue: '是否支持自提',
    value: false,
    type: 'switch',
    options: ['支持', '不支持']
  }, {
    key: 'freeDelivery',
    keyValue: '是否包邮',
    value: false,
    type: 'switch',
    options: ['支持', '不支持']
  },
  //  {
  //   key: 'cover',
  //   value: null,
  //   type: 'upload',
  //   action: 'https://yixiu.natappvip.cc/upload/',
  //   keyValue: '封面'
  // },
  {
    key: 'detail',
    value: null,
    type: 'textarea',
    keyValue: '详情'
  }, {
    key: 'tag',
    value: null,
    type: 'Arr',
    options: [],
    keyValue: '标签'
  }
]
let goodsKey = {
  name: {
    value: '',
  },
  unit: {
    value: '',
  },
  spec: {
    value: '',
  },
  category: {
    value: '',
  },
  brand: {
    value: '',
  },
  company: {
    value: '',
  },
  platform: {
    value: '',
  },
  mfrs: {
    value: '',
  },
  saleState: {
    value: '',
  },
  selfDeliverySupport: {
    value: '',
  },
  freeDelivery: {
    value: '',
  },
  tag: {
    value: '',
  },
  detail: {
    value: '',
  },
}
module.exports = {
  goodsThead,
  populate,
  or,
  addkey,
  goodsKey,
}
