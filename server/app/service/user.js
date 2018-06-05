const Service = require('egg').Service;

class UserService extends Service {
  async loginLocal(param) {
    const ctx = this.ctx;
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
    });
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
    let option = {};
    if (param.sys === 'cms') {
      option.sys = 'cms';
      if (user.company.length > 1) {
        if (!param.company) {
          ctx.throw(422, `请从请${user.company.length}个公司中选择一个登录`);
        }
        option.company = param.company;
      }
      if (user.company.length === 1 && user.platform.length === 1) {
        if (!param.company || !param.platform) {
          ctx.throw(422, `请选择一个公司或平台登录`);
        }
        if (param.company && param.platform) {
          ctx.throw(422, `不能同时登录平台和公司`);
        }
        if (param.company) {
          option.company = param.company;
        }
        if (param.platform) {
          option.platform = param.platform;
        }
      }
      if (user.company.length === 0 && user.platform.length === 1) {
        option.platform = user.platform[0];
      }
      if (user.platform.length === 0) {
        if (!user.isSys) {
          ctx.throw(422, `未指定平台的用户不能登录后台系统`);
        }
      }
    }
    let token = await ctx.service.jwt.sign(user, option);
    return {
      token: token.value,
      exp: token.expAt
    };
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
  async cascader() {
    const ctx = this.ctx;
    let res = [{
      label: '公司',
      value: 'company',
      children: []
    }, {
      label: '个人',
      value: 'user',
      children: []
    }];
    let companys = await ctx.model.Company.find();
    let companyRes = [];
    companys.forEach((item) => {
      let temp = JSON.parse(JSON.stringify(item));
      temp.label = item.name || item.mobile || item.tel;
      temp.value = item._id;
      companyRes.push(temp);
    })
    let users = await ctx.model.User.find();
    let userRes = [];
    users.forEach((item) => {
      let temp = JSON.parse(JSON.stringify(item));
      temp.label = item.name || item.mobile;
      temp.value = item._id;
      userRes.push(temp);
    })
    res[0].children = companyRes;
    res[1].children = userRes;
    return res;
  }

}
module.exports = UserService;