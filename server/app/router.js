'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
    middleware
  } = app;
  const checkToken = middleware.jwtVerify;
  router
    //第三方接口集成
    .post('/sms/send', 'lib.smsSend') //发送验证码
    .post('/sms/validate', 'lib.smsValidate') //验证验证码
    .post('/map/geocoder', 'lib.geocoder') //百度地图经纬度转地址信息
    .all('/bankcardinfo', 'lib.bankcardinfo') //根据卡号查询银行卡信息
    //用户接口
    .post('/register/mobile', 'user.registerMobile') //手机号注册
    .all('/logout', 'user.logout') //注销
    .post('/login/local', 'user.loginLocal') //密码登录
    .post('/login/sys', 'user.loginSys') //管理员密码登录
    .get('/loginInfo', checkToken(), 'user.loginInfo') //获取用户信息
    .all('/refleshToken', checkToken(), 'user.refleshToken') //刷新token
    .get('/field', checkToken(), 'field.index') //获取数据库字段信息
    .get('/roleCompany', checkToken(), 'user.roleCompany') //获取用户关联的所有公司
    .post('/rolePower', checkToken(), 'user.rolePower') //获取用户在某个公司的所有角色信息
    //公司接口
    .all('/company/user/cascader', checkToken(), 'company.userCascader') //公司用户级联数据
    .post('/company/receivablesTab', checkToken(), 'company.receivablesTab') //公司收款tab列表
    .post('/company/receivables', checkToken(), 'company.receivables') //公司收款详细数据
    //区域接口
    //商品接口
    //badge接口
    .all('/badge/header', checkToken(), 'badge.getHeaderBadge') //头部badge标识
    .post('/badge/sub/header', checkToken(), 'badge.getSubHeaderBadge') //sub头部badge标识
    //订单接口
    .post('/order/company/badge', checkToken(), 'order.companyBadge') //公司订单标记
    .get('/order/info/:_id', checkToken(), 'order.getOrderById') //根据id获取订单信息
    .post('/order/transfer', checkToken(), 'order.transfer') //转单
    .post('/order/check', checkToken(), 'order.check') //审核订单
    .post('/order/checkFail', checkToken(), 'order.checkFail') //订单审核失败
    .all('/order/pending/:state', checkToken(), 'order.pending') //获取待处理订单
    .post('/order/update/info', checkToken(), 'order.updateInfo') //更新订单基础信息
    .post('/order/update/businessTrains', checkToken(), 'order.updateBusinessTrains') //更新贸易链信息
    .post('/order/update/transportTrains', checkToken(), 'order.updateTransportTrains') //更新物流链信息
    //物流单接口
    .get('/logistics/company/badge', checkToken(), 'logistics.companyBadge') //公司运单标记
    .post('/logistics/company/badge', checkToken(), 'logistics.companyBadge') //公司运单标记
    .post('/logistics/check', checkToken(), 'logistics.check') //物流单审核
    .post('/logistics/checkFail', checkToken(), 'logistics.checkFail') //物流单审核失败
    .post('/logistics/handleTab', checkToken(), 'logistics.handleTab') //物流管理相关公司tab
    .post('/logistics/handleList', checkToken(), 'logistics.handleList') //物流管理节点列表
    //库存接口
    .post('/stock/multi', checkToken(), 'stock.multi') //批量添加库存单
    .post('/stock/simpleStatistics', checkToken(), 'stock.simpleStatistics') //简单的库存统计
    //贸易链接口
    .post('/businessTrains/multi/update/balancePrice', checkToken(), 'businessTrains.mutilUpdateBalancePrice') //批量更新贸易节点结算价格
    //结算接口
    // .post('/settle/businessTrains/tab', checkToken(), 'settle.getBusinessTrainsTab') //获取贸易链相关公司,准备展示结算列表
    //账户接口
    .post('/account/relation/tab', checkToken(), 'account.relationTab') //账户关联公司
    .post('/account/relation/list', checkToken(), 'account.relationList') //账户关联的流水列表
    .post('/account/relation/waiting_for_invoice', checkToken(), 'account.waitingForInvoice') //账户关联的可开票列表
    //账单流水接口
    .post('/accountChange/check', checkToken(), 'accountChange.check') //账单流水审核
    .post('/accountChange/checkFail', checkToken(), 'accountChange.checkFail') //账单流水审核失败
    //发票接口
    .post('/invoice/check', checkToken(), 'invoice.check') //发票审核
    .post('/invoice/checkFail', checkToken(), 'invoice.checkFail') //发票打回
    //页面接口
    .get('/', 'static.views') //根路径匹配
    .get(/views/, 'static.views') //根views页面
    .get(/zylp/, 'static.zylp') //匹配zylp页面
    .get(/test/, 'static.test') //匹配test页面
    //通用接口
    .all('/:model/:curdType', checkToken(), 'curd.index') //通用增删改查接口
    //404
    .all('*', 'notfound.index'); //404处理
};