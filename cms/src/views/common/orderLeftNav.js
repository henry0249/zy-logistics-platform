module.exports = {
  order: [{
      name: "订单计划",
      color: "red",
      icon: "icon-chuangjiandingdan",
      path: "/order/create",
      state: 'create'
    },
    {
      name: "待接单",
      color: "red",
      icon: "icon-jiedanyingli",
      path: "/order/taking",
      state: 'taking',
    },
    {
      name: "调度前审核",
      color: "red",
      icon: "icon-shenhe1",
      path: "/order/beforeDispatchCheck",
      state: 'beforeDispatchCheck',
    },
    {
      name: "配送完成审核",
      color: "red",
      icon: "icon-shenhe1",
      path: "/order/distributionFinishCheck",
      state: 'check',
    },
    {
      name: "结算前审核",
      color: "red",
      icon: "icon-shenhe1",
      path: "/order/beforeSettleCheck",
      state: 'beforeSettleCheck',
    },
    // {
    //   name: "所有订单",
    //   color: "red",
    //   icon: "icon-liebiao",
    //   state: 'all',
    //   path: "/order/all"
    // }
  ],
  dispatch: [{
      name: "待调度订单",
      color: "red",
      icon: "icon-tiaoduzhongxin",
      path: "/dispatch/order",
      state: 'dispatch',
    },
    {
      name: "待配送运单",
      color: "red",
      icon: "icon-cf-c97",
      path: "/dispatch/distribution",
      state: 'distribution',
    }
  ],
  settle: [{
      name: "订单预审",
      color: "red",
      icon: "icon-jiesuan",
      path: "/settle/financialPretrial",
      state: "financialPretrial"
    },
    {
      name: "账户结算",
      color: "red",
      icon: "icon-jiesuan",
      path: "/settle/accountSettlement",
      state: "accountSettlement"
    },
    {
      name: "账款确认",
      color: "red",
      icon: "icon-jiesuan",
      path: "/settle/accountConfirmation",
      state: "accountConfirmation"
    }
  ]
}
