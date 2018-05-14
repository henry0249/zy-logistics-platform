const Service = require('egg').Service;

class CompanyService extends Service {
  async require(curdType, param) {
    let requireObj = {
      add: ['name'],
      set: ['name']
    };
    if (curdType === 'add' || curdType === 'set') {
      if (param.isPlatform !== true) {
        requireObj[curdType].push('platform');
      }
    }
    return requireObj[curdType] || [];
  }
  async createCheck(param) {
    const ctx = this.ctx;
    const check = ctx.service.check;
    if (param.isPlatform !== undefined) {
      await check.sys(param, '操作平台标识需要系统管理员权限');
    }
  }
  async add(param) {
    const ctx = this.ctx;
    await this.createCheck(param);
    let admin = [ctx.user._id];
    if (param.isPlatform) {
      let sys = await ctx.service.curd.find(ctx.model.User, {
        isSys: true,
      })
      if (sys.length === 0) {
        ctx.throw(400, '未指定系统管理员', param);
      }
      admin = []
      sys.forEach(item => {
        admin.push(item._id)
      });
    }
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
}
module.exports = CompanyService;