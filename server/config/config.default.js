'use strict';
const path = require('path')
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = 'bymm_stjk';
  config.jwtKey = 'bymm_jwt';

  // 中间件配置
  config.middleware = ['errorHandler'];

  //mongoose插件配置
  config.mongoose = {
    clients: {
      // clientId, access the client instance by app.mongooseDB.get('clientId')
      zylp: {
        url: 'mongodb://zylp:pxh5201798@localhost:27017/zy-logistics-platform',
        options: {
          useMongoClient: true
        }
      }
    }
  };

  //session设置
  exports.session = {
    key: 'BYMM_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
    renew: true
  };

  //安全设置
  config.security = {
    csrf: {
      ignoreJSON: false,
      enable: false,
      useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
    },
  };
  return config;
};