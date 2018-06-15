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
    //用户接口
    .post('/register/mobile', 'user.registerMobile') //手机号注册
    .all('/logout', 'user.logout') //注销
    .post('/login/local', 'user.loginLocal') //密码登录
    .get('/loginInfo', checkToken(), 'user.loginInfo') //获取用户信息
    .all('/refleshToken', checkToken(), 'user.refleshToken') //刷新token
    .get('/field', checkToken(), 'field.index') //获取数据库字段信息
    .all('/user/cascader', checkToken(), 'user.cascader') //用户级联数据
    //公司接口
    .all('/company/user/cascader', checkToken(), 'company.userCascader') //公司用户级联数据
    //区域接口
    .all('/area/cascader', 'area.cascader') //区域级联数据
    //商品接口
    .all('/goods/cascader', checkToken(), 'goods.cascader') //商品级联数据
    //订单接口
    .get('/order/badge', checkToken(), 'order.badge') //订单标记
    .get('/order/:_id', checkToken(), 'order.getOrderById') //根据id获取订单信息
    .all('/order/pending/:state', checkToken(), 'order.pending') //获取待处理订单
    //中转地接口
    .all('/transfer/cascader', 'transfer.cascader') //中转地级联数据
    //平台接口
    .post('/platform/orgTree', checkToken(), 'platform.orgTree') //平台组织结构
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