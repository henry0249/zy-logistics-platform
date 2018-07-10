const Service = require('egg').Service;

class LogisticsTrajectoryService extends Service {
  async find() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    if (!body.logistics) {
      ctx.throw(422, "运单信息必填", body);
    }
    let trajectorys = await ctx.model.LogisticsTrajectory.find({
      logistics: body.logistics
    }).sort({
      time: 1
    });
    let res = [];
    for (let i = 0; i < trajectorys.length; i++) {
      let item = JSON.parse(JSON.stringify(trajectorys[i]));
      let updateFlag = false;
      if (i === 0 && item.type !== 0) {
        item.type = 0;
        updateFlag = true;
      }
      if (i !== 0 && item.type === 0) {
        item.type = 1;
        updateFlag = true;
      }
      if (i !== trajectorys.length - 1 && item.type === 3) {
        item.type = 1;
        updateFlag = true;
      }
      delete item._id;
      delete item.createdAt;
      delete item.updatedAt;
      if (updateFlag) {
        await ctx.model.LogisticsTrajectory.update({
          _id: trajectorys[i]._id
        }, item);
      }
      item._id = trajectorys[i]._id;
      res.push(item);
    }
    return res;
  }
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
    if (!logistics) {
      ctx.throw(404, "运单不存在", body);
    }
    if (body.remove instanceof Array && body.remove.length > 0) {
      for (let i = 0; i < body.remove.length; i++) {
        if (body.remove[i]._id) {
          await ctx.model.LogisticsTrajectory.remove({
            _id: body.remove[i]._id
          })
        }
      }
    }
    for (let i = 0; i < body.point.length; i++) {
      let item = body.point[i];
      if (item._id) {
        let _id = item._id;
        delete item._id;
        delete item.createdAt;
        delete item.updatedAt;
        await ctx.model.LogisticsTrajectory.update({
          _id: _id
        }, item);
      } else {
        item.logistics = logistics._id;
        item.author = ctx.user._id;
        let model = new ctx.model.LogisticsTrajectory(item);
        await model.save();
      }
    }
    return 'ok';
  }
}
module.exports = LogisticsTrajectoryService;