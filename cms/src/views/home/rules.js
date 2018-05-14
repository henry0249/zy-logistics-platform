export default {
  PublishingCompany: [{
    required: true,
    message: '请选择活动区域',
    trigger: 'change'
  }],
  transportation: [{
    required: true,
    message: '请选择运输方式',
    trigger: 'change'
  }],
  startAt: [{
    type: 'date',
    required: true,
    message: '请选择开始时间',
    trigger: 'change'
  }],
  endAt: [{
    type: 'date',
    required: true,
    message: '请选择时间',
    trigger: 'change'
  }],
  commodityType: [{
    required: true,
    message: '请选择类型',
    trigger: 'change'
  }],
  price: [{
    required: true,
    message: '请填写总价',
    trigger: 'blur'
  }],
  tonnage: [{
    required: true,
    message: '请填写吨数',
    trigger: 'blur'
  }],
  destination: [{
    required: true,
    message: '请填写目的地',
    trigger: 'blur'
  }],
  from: [{
    required: true,
    message: '请填写出发地',
    trigger: 'blur'
  }]
}
