const Service = require('egg').Service;

class CompanyService extends Service {
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
}
module.exports = CompanyService;