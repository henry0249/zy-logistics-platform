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
    .post('/login/local', 'user.loginLocal') //密码登录
    .post('/sms/send', 'lib.smsSend') //发送验证码
    .post('/sms/validate', 'lib.smsValidate') //验证验证码
    .post('/register/mobile', 'user.registerMobile') //手机号注册
    .get('/loginInfo', checkToken(), 'user.loginInfo') //获取用户信息
    .get('/field', checkToken(), 'field.index') //获取数据库字段信息
    .all('/refleshToken', checkToken(), 'user.refleshToken') //刷新token
    .all('/logout', 'user.logout') //注销

    .post('/area/add', checkToken(), 'area.add') //添加区域
    .all('/area/select', checkToken(), 'area.findForSelect') //区域数据
    .post('/platform/orgTree', checkToken(), 'platform.orgTree') //平台组织结构

    .get('/', 'static.views') //根路径匹配
    .get(/views/, 'static.views') //根views页面
    .get(/zylp/, 'static.zylp') //匹配zylp页面
    .get(/test/, 'static.test') //匹配test页面

    .all('/:model/:curdType', checkToken(), 'curd.index') //通用增删改查接口

    .all('*', 'notfound.index'); //404处理
};