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
      let order = await ctx.model.Order.findById(logistics.order);
      await ctx.service.check.role(['dispatcher', 'sysDispatcher'], order.handle);
    }
    if (body.transportation === 'truck') {
      delete body.ship;
    }
    if (body.transportation === 'ship') {
      delete body.truck;
    }
    if (body.state > 0 && !body[body.transportation]._id) {
      ctx.throw(422, `运单${logisticsField.state.option[body.state]}前必须填写车船信息`, body);
    }
    if (body[body.transportation]) {
      body[body.transportation] = body[body.transportation]._id || body[body.transportation];
    }
    delete body._id;
    delete body.updatedAt;
    delete body.createdAt;
    await logistics.update(body);
    return 'ok';
  }
  async companyBadge() {
    const ctx = this.ctx;
    let res = [];
    let sysDispatcherRole = await ctx.model.Role.findOne({
      type: 'sysDispatcher',
      user: ctx.user._id
    });
    let companylist = [];
    if (sysDispatcherRole) {
      let aggregateCompany = await ctx.model.Logistics.aggregate([{
        $group: {
          _id: "$handle",
          // data: {
          //   $push: "$$ROOT"
          // }
        },
      }]);
      aggregateCompany.forEach(item => {
        companylist.push(item._id);
      });
    }else{
      let dispatcherRole = await ctx.model.Role.find({
        type: 'dispatcher',
        user: ctx.user._id
      });
      let mySet = new Set();
      for (let i = 0; i < dispatcherRole.length; i++) {
        let item = dispatcherRole[i];
        if (item.company) {
          mySet.add(item.company.toString());
        }
      }
      companylist = [...mySet];
    }
    let companyData = await ctx.model.Company.find({
      _id:{
        $in:companylist
      }
    });
    for (let i = 0; i < companyData.length; i++) {
      let item =  JSON.parse(JSON.stringify(companyData[i]));
      item.badge = await ctx.model.Logistics.count({
        state: {
          $nin: [5]
        },
        handle: item._id
      });
      res.push(item);
    }
    return res;
  }
}
module.exports = LogisticsService;