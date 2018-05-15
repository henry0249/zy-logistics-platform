const Service = require('egg').Service;

class PlatformService extends Service {
  async beforeCurd(curdType, param) {
    console.log(this);
    const ctx = this.ctx;
    const check = ctx.service.check;
    if (curdType === 'add' || curdType === 'set') {
      await check.platformAdmin(param);
    }
  }
  async add(param) {
    const ctx = this.ctx;
    let admin = [];
    let sys = await ctx.service.curd.find(ctx.model.User, {
      isSys: true,
    });
    if (sys.length === 0) {
      ctx.throw(400, '未指定系统管理员', param);
    }
    sys.forEach(item => {
      admin.push(item._id)
    });
    return {
      ...param,
      creater: ctx.user._id,
      owner: ctx.user._id,
      admin
    };
  }
  async set(param) {
    return await this.add(param);
  }
  async curdCallback(param) {
    const ctx = this.ctx;
    if (param.curdType === 'set' || param.curdType === 'add') {
      let user = await ctx.service.curd.find(ctx.model.User, {
        _id: {
          $in: [
            ...param.data.admin,
            ...param.data.salesman,
            ...param.data.auditor,
            ...param.data.dispatcher,
            ...param.data.financial
          ]
        },
      });
      for (let i = 0; i < user.length; i++) {
        await user[i].update({
          platform: param.data._id
        })
      }
    }
    return param.data;
  }
}
module.exports = PlatformService;