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
    .post('/login/local', 'user.loginLocal')
    .post('/register/mobile', 'user.registerMobile')
    .get('/user', checkToken(), 'user.info')
    .all('/refleshToken', checkToken(), 'user.refleshToken')
    .all('/logout', 'user.logout')
    .post('/sms/send', 'lib.smsSend')
    .post('/sms/validate', 'lib.smsValidate')
    .post('/yixiu/sms/send', 'lib.yixiuSmsSend')
    .post('/yixiu/sms/validate', 'lib.yixiuSmsValidate')

    .get('/', 'static.views')
    .get(/views/, 'static.views')
    .get(/zylp/, 'static.zylp')

    .all('/:model/:curdType', checkToken(), 'curd.index')

    .all('*', 'notfound.index');
};