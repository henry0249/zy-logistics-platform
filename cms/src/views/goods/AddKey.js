export default [{
  key: 'brand',
  value: null,
  type: 'select',
  keyValue: '品牌',
  options: []
}, {
  key: 'category',
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
  key: 'tag',
  value: null,
  type: 'Arr',
  options: [],
  keyValue: '标签'
}, {
  key: 'company',
  value: null,
  type: 'select',
  keyValue: '发布公司',
  options: []
}, {
  key: 'platform',
  value: null,
  type: 'select',
  keyValue: '发布平台',
  options: []
}, {
  key: 'saleState',
  value: null,
  type: 'select',
  keyValue: '售卖状态',
  options: [{
    value: 0,
    label: '未上架'
  }, {
    value: 1,
    label: '正常售卖'
  }, {
    value: 2,
    label: '缺货'
  }, {
    value: 3,
    label: '已下架'
  }, {
    value: 4,
    label: '不展示'
  }]
},
//  {
//   key: 'cover',
//   value: null,
//   type: 'upload',
//   action: 'https://yixiu.natappvip.cc/upload/',
//   keyValue: '封面'
// },
 {
  key: 'desc',
  value: null,
  type: 'textarea',
  keyValue: '描述'
}, {
  key: 'remark',
  value: null,
  type: 'textarea',
  keyValue: '备注'
}, {
  key: 'detail',
  value: null,
  type: 'textarea',
  keyValue: '详情'
}]
