const Service = require('egg').Service;
const areaField = require('../field/Area');

class CompanyService extends Service {

  async add() {
    return await this.set();
  }
  async set() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let res = {};
    if (body._id) {
      return body;
    }
    if (!(body.type === 'user' || body.type === 'company')) {
      ctx.throw('422', '账户类型错误');
    }
    if (!body.company) {
      ctx.throw('422', '公司信息必填');
    }
    if (!body.relationUser && !body.relationCompany) {
      ctx.throw('422', '关联信息错误');
    }
    if (body.relationUser && body.relationCompany) {
      ctx.throw('422', '不能同时关联公司和用户');
    }
    let findBody = {
      type: body.type,
      company: body.company
    };
    if (body.type === 'user') {
      findBody.relationUser = body.relationUser;
    }
    if (body.type === 'company') {
      findBody.relationCompany = body.relationCompany;
    }
    let hasAccount = await ctx.model.Account.findOne(findBody);
    if (hasAccount) {
      return hasAccount;
    }
    let model = new ctx.model.Account(body);
    await model.save();
    res = await ctx.model.Account.findById(model._id);
    return res;
  }
}
module.exports = CompanyService;