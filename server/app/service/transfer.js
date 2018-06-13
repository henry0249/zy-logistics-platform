const Service = require('egg').Service;

class TransferService extends Service {
  async set(){
    return await this.add();
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.name) {
      ctx.throw(422, '中转点名称必填', body);
    }
    let area = await ctx.service.area.add(true);
    let transferModel = new ctx.model.Transfer({
      name:body.name,
      area:area
    });
    await transferModel.save();
    return transferModel._id;
  }
}
module.exports = TransferService;