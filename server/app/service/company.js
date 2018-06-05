const Service = require('egg').Service;

class CompanyService extends Service {
  async beforeCurd(curdType, param) {
    const ctx = this.ctx;
    const check = ctx.service.check;
    if (curdType === 'add' || curdType === 'set') {
      await check.companyAdmin(param);
    }
  }
  async add(param) {
    const ctx = this.ctx;
    return {
      ...param,
      creater: ctx.user._id,
      owner: ctx.user._id,
    };
  }
  async set(param) {
    return await this.add(param);
  }
  async setCallback(param) {
    return param.data;
  }
}
module.exports = CompanyService;