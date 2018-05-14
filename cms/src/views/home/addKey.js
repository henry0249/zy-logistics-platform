export default [{
    key: 'PublishingCompany',
    keyValue: '发布公司',
    value:null,
    type: 'select',
    options: [{
      value: '发布公司',
      label: '发布公司'
    }, {
      value: '发布公司1',
      label: '发布公司1'
    }]
  }, {
    key: 'transportation',
    keyValue: '运输方式',
    value:null,
    type: 'select',
    options: [{
      value: '空运',
      label: '空运'
    }, {
      value: '船运',
      label: '船运'
    }]
  }, {
    key: 'startAt',
    keyValue: '开始时间',
    value:null,
    type: 'date'
  }, {
    key: 'endAt',
    keyValue: '结束时间',
    value:null,
    type: 'date'
  }, {
    key: 'commodityType',
    keyValue: '类型',
    value:null,
    type: 'select',
    options: [{
      value: '水泥',
      label: '水泥'
    }, {
      value: '砂石',
      label: '砂石'
    }, {
      value: '板材',
      label: '板材'
    }, {
      value: '钢筋',
      label: '钢筋'
    }, {
      value: '化工',
      label: '化工'
    }]
  },
  {
    key: 'price',
    keyValue: '总价（元）',
    value: null,
    type: 'input'
  },
  {
    key: 'tonnage',
    keyValue: '吨数（t）',
    value: null,
    type: 'input'
  },
  {
    key: 'destination',
    keyValue: '目的地',
    value:null,
    type: 'input'
  },
  {
    key: 'from',
    keyValue: '出发地',
    value:null,
    type: 'input'
  }
]
