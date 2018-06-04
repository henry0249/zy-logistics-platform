let categoryThead = {
  'name': {
    name: '分类名'
  },
  "desc": {
    name: '描述'
  },
  "remark": {
    name: '备注'
  }
}
let keyArr = [{
    key: "name",
    keyValue: "分类名",
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
    key: "desc",
    keyValue: "描述",
    value: null,
    type: "textarea"
  },
  {
    key: "remark",
    keyValue: "备注",
    value: null,
    type: "textarea"
  }, {
    key: 'parent.name',
    value: null,
    type: 'select',
    keyValue: '上级分类',
    options: []
  }
]
module.exports = {
  categoryThead,
  keyArr
}
