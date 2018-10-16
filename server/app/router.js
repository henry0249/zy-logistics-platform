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
    //lib
    .post('/sms/send', 'lib.smsSend') //发送验证码
    .post('/sms/validate', 'lib.smsValidate') //验证验证码
    .post('/map/geocoder', 'lib.geocoder') //百度地图经纬度转地址信息
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
    //区域接口
    //商品接口
    //订单接口
    .get('/order/badge', checkToken(), 'order.badge') //订单标记
    .post('/order/company/badge', checkToken(), 'order.companyBadge') //公司订单标记
    .get('/order/info/:_id', checkToken(), 'order.getOrderById') //根据id获取订单信息
    .post('/order/transfer', checkToken(), 'order.transfer') //转单
    .post('/order/dispatch', checkToken(), 'order.dispatch') //订单提交配送
    .post('/order/mutilUpdate', checkToken(), 'order.mutilUpdate') //批量修改订单信息
    .post('/order/checkFail', checkToken(), 'order.checkFail') //订单审核失败
    .all('/order/pending/:state', checkToken(), 'order.pending') //获取待处理订单
    //运单接口
    .get('/logistics/company/badge', checkToken(), 'logistics.companyBadge') //公司运单标记
    .post('/logistics/company/badge', checkToken(), 'logistics.companyBadge') //公司运单标记
    //库存接口
    .post('/stock/multi', checkToken(), 'stock.multi') //批量添加库存单
    .post('/stock/simpleStatistics', checkToken(), 'stock.simpleStatistics') //简单的库存统计
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