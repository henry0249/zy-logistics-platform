const Service = require('egg').Service;
const logisticsField = require('../field/Logistics');

class LogisticsService extends Service {
  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) {
      ctx.throw(422, "运单编号必填", body);
    }
    let logistics = await ctx.model.Logistics.findById(body._id);
    if (!logistics) {
      ctx.throw(404, "运单不存在", body);
    }
    if (logistics.order) {
      let hasPower = await ctx.model.Order.findOne({
        _id:logistics.order,
        dispatcher:{
          $in:[ctx.user._id]
        },
        documentClerk:{
          $in:[ctx.user._id]
        }
      })
      if (!hasPower) {
        ctx.throw(403, "您无权操作此运单信息", body);
      }
    }
    if (body.state > 0 && !(body.truck || body.ship)) {
      ctx.throw(422, `运单${logisticsField.state.option[body.state]}后必须填写车船信息`, body);
    }
    delete body._id;
    delete body.updatedAt;
    delete body.createdAt;
    await logistics.update(body);
    return 'ok';
  }
}
module.exports = LogisticsService;