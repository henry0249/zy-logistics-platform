let categoryThead = {
  'name': {
    readOnly: true,
    slot:true,
    name: '品牌名',
  },
  "tag": {
    readOnly: true,
    slot:true,
    name: '标签'
  },
  "type": {
    readOnly: true,
    name: '类型'
  },
  "category": {
    readOnly: true,
    slot:true,
    name: '分类'
  }
}
let keyArr = [{
    key: "name",
    keyValue: "品牌名",
    value: null,
    type: "input"
  },
  // {
  //   key: 'cover',
  //   value: null,
  //   type: 'upload',
  //   action: 'https://yixiu.natappvip.cc/upload/',
  //   keyValue: '封面'
  // },
  {
    key: "tag",
    keyValue: "标签",
    value: null,
    type: "Arr"
  },
  {
    key: "type",
    keyValue: "类型",
    value: null,
    type: "input"
  }, {
    key: 'category.name',
    value: null,
    type: 'brankCategory',
    keyValue: '分类',
    // options: []
  }
]
module.exports = {
  categoryThead,
  keyArr
}
