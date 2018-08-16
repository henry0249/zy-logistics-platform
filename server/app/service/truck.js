const Service = require('egg').Service;

class TruckService extends Service {
  async find() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    delete body.limit;
    delete body.skip;
    delete body.populate;
    let populate = [{
      path: 'owner',
    },{
      path:'company'
    }];
    let res = [];
    if (body.limit === 0) {
      res = await ctx.model.Truck.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      })
    } else {
      res = await ctx.model.Truck.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      }).limit(limit).skip(skip);
    }
    return res;
  }
}
module.exports = TruckService;