export default {
  user: [{
    name: '添加用户',
    icon: 'icon-jia',
    path: '/sys/user/add'
  }, {
    name: '用户列表',
    icon: 'icon-icon-test',
    path: '/sys/user/list'
  }],
  company: [{
    name: '添加公司',
    icon: 'icon-jia',
    path: '/sys/company/add'
  }, {
    name: '公司列表',
    icon: 'icon-icon-test',
    path: '/sys/company/list'
  }],
  goods: [{
      name: '添加商品',
      icon: 'icon-jia',
      path: '/sys/goods/add'
    }, {
      name: '添加品牌',
      icon: 'icon-jia',
      path: '/sys/goods/brand_add'
    }, {
      name: '添加分类',
      icon: 'icon-jia',
      path: '/sys/goods/category_add'
    }, {
      name: '商品列表',
      icon: 'icon-liebiao',
      path: '/sys/goods/list'
    },
    {
      name: "分类列表",
      color: "orange",
      icon: "icon-fenlei",
      path: "/sys/goods/category"
    },
    {
      name: "品牌列表",
      color: "orange",
      icon: "icon-shangbiao",
      iconSize: '15',
      path: "/sys/goods/brand"
    }
  ],
  area: [{
    name: 'icon-jia',
    icon: 'icon-icon-test',
    path: '/sys/area/add'
  }, {
    name: '地区列表',
    icon: 'icon-icon-test',
    path: '/sys/area/list'
  }],
  system: [{
    name: '系统业务员',
    icon: 'icon-icon-test',
    path: '/sys/system/sys_saleman'
  }, {
    name: '系统调度员',
    icon: 'icon-icon-test',
    path: '/sys/system/sys_dispatcher'
  }]
}
