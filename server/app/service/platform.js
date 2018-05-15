const Service = require('egg').Service;

class PlatformService extends Service {
  async beforeCurd(curdType, param) {
    const ctx = this.ctx;
    if (curdType === 'add' || curdType === 'set') {
      if (!ctx.user.isSys) {
        let isPlatformAdmin = ctx.service.curd.findOne(ctx.model.Platform, {
          admin: { in: [ctx.user._id]
          }
        });
        if (!isPlatformAdmin) {
          ctx.throw(404, '需要平台管理员或系统管理员权限', param);
        }
      }
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