const Service = require('egg').Service;

class PassportService extends Service {
  async index(user) {
    const {
      ctx
    } = this;
    // ctx.throw(403, '暂不支持此方式登录', user);
    if (this[user.provider]) {
      return await this[user.provider](user);
    }
    return user;
  }
  async local(param) {
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
      }]
    })
    if (!user._id) {
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
    ctx.session.user = user;
    return user;
  }

}
module.exports = PassportService;