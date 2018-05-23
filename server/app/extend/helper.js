const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const is = require('is_js');

module.exports = {
  index(param) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  },
  staticFilter(url) {
    let filter = ['.js', '.css', '.gz', '.jpg', 'png', '.html']
    let path = 'index.html'
    filter.forEach(item => {
      if (url.indexOf(item) > -1) {
        path = url
      }
    })
    return path
  },
  aesEncrypt(data) {
    const cipher = crypto.createCipher('aes192', this.config.keys);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },
  aesDecrypt(encrypted) {
    const decipher = crypto.createDecipher('aes192', this.config.keys);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
  async jwtSign(user_info, option = {}) {
    let exp = option.exp || Math.floor(Date.now() / 1000) + (2 * 60 * 60);
    delete option.exp;
    let token = await jwt.sign({
      user: {
        ...user_info,
        ...option
      },
      exp
    }, this.config.jwtKey)
    return {
      value: token,
      expAt: new Date(exp * 1000)
    }
  },
  async jwtVerify(token) {
    const {
      ctx
    } = this;
    if (token === undefined || token === 'undefined') {
      ctx.throw(401, '获取用户凭证失败,请尝试重新登录');
    }
    try {
      let decoded = await jwt.verify(token, this.config.jwtKey)
      if (!decoded.user) {
        ctx.throw(401, '用户身份过期,请尝试重新登录');
      }
      return decoded.user
    } catch (err) {
      ctx.throw(401, '用户身份认证失败,请尝试重新登录');
    }
  },
  ua() {
    let useragent = require('useragent');
    let req = this.ctx.request;
    let agent = useragent.parse(req.headers['user-agent']);
    const requestIp = require('request-ip');
    const clientIp = requestIp.getClientIp(req);
    let obj = {
      ua: agent.toString(),
      uaSource: agent.source,
      ip: clientIp
    }
    return obj
  },
  is(funName, val, all) {
    if (all) {
      return is.all[funName](val);
    } else {
      return is[funName](val);
    }
  },
  isEmpty(param) {
    return is.empty(param);
  },
  inArr(arr, obj) {
    let flag = false;
    if (!is.array(arr)) {
      return false;
    }
    arr.forEach((item) => {
      if (item === obj) {
        flag = true;
      }
    })
    return flag;
  }
};