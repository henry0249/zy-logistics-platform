const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const is = require('is_js');
const dayjs = require('dayjs');

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
    let exp = option.exp || this.config.loginExp;
    delete option.exp;
    let token = await jwt.sign({
      user: {
        ...user_info,
        ...option
      },
      exp: Math.floor((new Date().getTime() + exp) / 1000)
    }, this.config.jwtKey);
    return {
      value: token,
      exp,
      expAt: new Date(new Date().getTime() + exp)
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
      if (item.toString() === obj.toString()) {
        flag = true;
      }
    })
    return flag;
  },
  idArr(arr) {
    let temp = [];
    arr.forEach((item) => {
      temp.push(item.toString());
    });
    return temp;
  },
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  },
  no(goods_id, user_id, pre = "1") {
    let goods_str = this.objectid2random(goods_id);
    let user_str = this.objectid2random(user_id);
    let timestrap = new Date().getTime().toString().substr(13 - 2);
    let random = this.randomNum(1000,9999);
    let res = goods_str + user_str + timestrap + random.toString();
    return pre.toString() + res;
  },
  objectid2random(_id) {
    let val = _id.toString().slice(18);
    let str = parseInt(val, 16).toString();
    if (str.length < 2) {
      let temp = {
        1: '0' + str,
        0: '00'
      };
      return temp[str.length];
    } else {
      return str.substr(str.length - 2);
    }
  },
  formatTime(val, str = "YYYY-MM-DD HH:mm:ss"){
    if (val) {
      return dayjs(val).format(str);
    } else {
      return dayjs().format(str);
    }
  }
};