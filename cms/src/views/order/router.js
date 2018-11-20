import App from './App.vue';
import Create from './Create.vue';
import Salesman from './Salesman';
import SalesmanManager from './SalesmanManager';
import TradeClerk from './TradeClerk';

export default [{
  path: '/order',
  component: App,
  redirect: '/order/create',
  name: '订单管理',
  meta: {
    keepAlive: true // 需要被缓存
  },
  children: [{
      path: '/order/create',
      component: Create,
      name: '创建订单',
      meta: {
        nav: true,
      }
    }, {
      path: '/order/salesman',
      component: Salesman,
      name: '业务员审核',
      meta: {
        nav: true,
        desc: '客户下单后,业务专员审核基础信息,推送给业务经理进行审核',
        state: 'salesman'
      },
      children:[{
        path:'/order/salesman/edit/:_id',
        component: Salesman,
        name: '业务员审核订单详情'
      }]
    }, {
      path: '/order/salesmanManager',
      component: SalesmanManager,
      name: '业务经理审核',
      meta: {
        state:'salesmanManager',
        nav: true,
        desc: '业务经理再次审核订单基础信息,审核通过后推送给贸易文员进行贸易链的添加'
      },
      children:[{
        path:'/order/salesmanManager/edit/:_id',
        component: SalesmanManager,
        name: '业务经理审核订单详情'
      }]
    }, {
      path: '/order/tradeClerk',
      component: TradeClerk,
      name: '贸易文员审核',
      meta: {
        state:'tradeClerk',
        nav: true,
        desc: '贸易文员再次审核订单基础信息,并添加贸易链,审核通过后进入调度环节'
      },
      children:[{
        path:'/order/tradeClerk/edit/:_id',
        component: TradeClerk,
        name: '贸易文员审核订单详情'
      }]
    }
  ]
}]
