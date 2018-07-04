const Service = require('egg').Service;

class LogisticsTrajectoryService extends Service {
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.logistics) {
      ctx.throw(422, "运单信息必填", body);
    }
    if (!(body.point instanceof Array)) {
      ctx.throw(422, "轨迹信息必填", body);
    }
    let logistics = await ctx.model.Logistics.findById(body.logistics);
    for (let i = 0; i < body.point.length; i++) {
      let item = body.point[i];
      if (i === body.point.length - 1 && item.type === 0) {
        item.type = 1;
      }
      if (item._id) {
        let _id = item._id;
        delete item._id;
        item.author = ctx.user._id;
        await ctx.model.LogisticsTrajectory.update({
          _id: _id
        }, item);
      } else {
        item.logistics = logistics._id;
        item.author = ctx.user._id;
        let model = new ctx.model.LogisticsTrajectory(item);
        // await model.save();
      }
    }
    return 'ok';
  }
}
module.exports = LogisticsTrajectoryService;