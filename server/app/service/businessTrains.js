const Service = require('egg').Service;

class BusinessTrainsService extends Service {
  async delete() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    if (!body._id) {
      ctx.throw(422, '删除参数不完整', body);
    }
    await ctx.service.curd.delete(ctx.model.BusinessTrains, {
      _id: body._id
    });
    await ctx.service.curd.delete(ctx.model.Stock, {
      businessTrains: body._id,
      multi: true,
      state: 'ready'
    });
    return 'ok';
  }
}
module.exports = BusinessTrainsService;