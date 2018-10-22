const Service = require('egg').Service;
const RelationCodeField = require('../field/RelationCode');

class RelationCodeService extends Service {
  async multi() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!(body && body instanceof Array && body.length > 0)) {
      ctx.throw(422, '批量操作失败,未接收到操作数据', body);
    }
    for (let i = 0; i < body.length; i++) {
      const item = body[i];
      await this.set(item);
    }
    return 'ok';
  }
  async set(data) {
    const ctx = this.ctx;
    let body = data || ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息获取失败', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司信息获取失败', body);
    }
    let codeValue, hasCode;
    do {
      codeValue = Math.random().toString().slice(2, 10);
      hasCode = await ctx.model.RelationCode.findOne({
        value: codeValue
      });
    }
    while (!!hasCode);
    if (!hasCode) {
      let modelBody = {
        value: codeValue,
        company: body.company
      };
      if (Number(body.expiration) > 0) {
        modelBody.expiration = Number(body.expiration);
      }
      if (RelationCodeField.type.option[body.type]) {
        modelBody.type = body.type;
      }
      let codeModel = new ctx.model.RelationCode(modelBody);
      await codeModel.save();
    }
    return codeValue;
  }
  async add() {
    return await this.set();
  }
}
module.exports = RelationCodeService;