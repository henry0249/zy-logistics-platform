const Service = require('egg').Service;

class UserService extends Service {
  async loginLocal(param) {
    const {
      ctx
    } = this;
    if (!param.username) {
      ctx.throw(406, '手机号/用户名/邮箱不能为空', {
        path: ctx.path
      });
    }
    if (!param.password) {
      ctx.throw(406, '密码不能为空', {
        path: ctx.path,
        username: param.username
      });
    }
    let user = await ctx.service.curd.findOne(ctx.model.User, {
      $or: [{
        mobile: param.username
      }, {
        name: param.username
      }, {
        email: param.username
      }],
      populate:[{
        path:'company'
      },{
        path:'platform'
      }]
    })
    if (!user) {
      ctx.throw(404, '用户不存在', {
        path: ctx.path,
        username: param.username
      });
    }
    try {
      let password = ctx.helper.aesDecrypt(user.password);
      if (password !== param.password) {
        ctx.throw(404, '密码错误', {
          path: ctx.path,
          username: param.username
        });
      }
    } catch (error) {
      ctx.throw(404, '密码错误', {
        path: ctx.path,
        username: param.username
      });
    }
    let token = await ctx.service.jwt.sign(user);
    return {
      user,
      token: token.value,
      tokenExp: token.expAt
    };
  }

  async registerMobile() {
    const {
      ctx
    } = this;
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
    const {
      ctx
    } = this;
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
    const {
      ctx
    } = this;
    let models = require('../field')('ALL');
    return models
  }

}
module.exports = UserService;