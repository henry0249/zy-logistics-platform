const Service = require('egg').Service;

class UserService extends Service {
  async getUserInfo() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.username) {
      ctx.throw(406, '手机号/用户名/邮箱不能为空', {
        path: ctx.path
      });
    }
    if (!body.password) {
      ctx.throw(406, '密码不能为空', {
        path: ctx.path,
        username: body.username
      });
    }
    let user = await ctx.service.curd.findOne(ctx.model.User, {
      $or: [{
        mobile: body.username
      }, {
        name: body.username
      }, {
        email: body.username
      }]
    });
    if (!user) {
      ctx.throw(404, '用户不存在', {
        path: ctx.path,
        username: body.username
      });
    }
    try {
      let password = ctx.helper.aesDecrypt(user.password);
      if (password !== body.password) {
        ctx.throw(404, '密码错误', {
          path: ctx.path,
          username: body.username
        });
      }
    } catch (error) {
      ctx.throw(404, '密码错误', {
        path: ctx.path,
        username: body.username
      });
    }
    return user;
  }
  async loginLocal() {
    const ctx = this.ctx;
    let user = await this.getUserInfo();
    let res = {};
    let token = await ctx.service.jwt.sign(user);
    res.token = token.value;
    res.exp = token.expAt;
    return res;
  }
  async loginSys() {
    const ctx = this.ctx;
    let user = await this.getUserInfo();
    if (!user.isSys) {
      ctx.throw(400, '您不是管理员', user);
    }
    let res = {};
    let token = await ctx.service.jwt.sign(user);
    res.token = token.value;
    res.exp = token.expAt;
    return res;
  }
  async registerMobile() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.password) {
      ctx.throw(400, '密码不能为空', req);
    }
    let mobile = await ctx.service.sms.validate(req);
    let hasUser = await ctx.service.curd.findOne(ctx.model.User, {
      mobile: mobile
    });
    if (hasUser) {
      ctx.throw(406, '此手机号已经注册', req);
    }
    let password = ctx.helper.aesEncrypt(req.password);
    let user = await ctx.service.curd.set(ctx.model.User, {
      mobile: mobile,
      password: password,
      vd: {
        mobile: mobile,
      }
    });
    return user.mobile
  }
  async logout() {
    const ctx = this.ctx;
    let {
      header,
      body,
    } = ctx.request;
    let token = header.authorization || body.token;
    if (token) {
      await ctx.model.Jwt.update({
        value: token
      }, {
        value: '',
        logoutAt: new Date()
      });
    }
    return '成功注销';
  }
  async power() {
    const ctx = this.ctx;
    let models = require('../field')('ALL');
    return models
  }
}
module.exports = UserService;