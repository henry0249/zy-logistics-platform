const Service = require('egg').Service;
const logisticsField = require('../field/Logistics');

class LogisticsService extends Service {
  async find() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    let roleList = ['sysDispatcher', 'dispatcher', 'logisticsClerk', 'dispatcherManager'];
    if (!body.role || roleList.indexOf(body.role) < 0) {
      // ctx.throw(422, "权限信息获取失败", body);
      return [];
    }
    if (!body.handle) {
      // ctx.throw(422, "当前公司信息获取失败", body);
      return [];
    }
    let hasRole = await ctx.model.Role.findOne({
      type: body.role,
      company: body.handle
    });
    if (!hasRole) {
      // ctx.throw(422, "无查看权限", body);
      return [];
    }
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    let populate = body.populate || [];
    delete body.role;
    delete body.limit;
    delete body.skip;
    delete body.populate;
    let res = [];
    if (body.limit === 0) {
      res = await ctx.model.Logistics.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      })
    } else {
      res = await ctx.model.Logistics.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      }).limit(limit).skip(skip);
    }
    return res;
  }
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
      await ctx.service.check.role(['sysDispatcher', 'dispatcher', 'logisticsClerk', 'dispatcherManager'], order.handle);
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
    let body = ctx.request.body;
    let roleList = ['sysDispatcher', 'dispatcher', 'logisticsClerk', 'dispatcherManager'];
    if (!body.role || roleList.indexOf(body.role) < 0) {
      ctx.throw(422, "权限信息获取失败", body);
    }
    let res = [];
    let companylist = [];
    let dispatcherRole = await ctx.model.Role.find({
      type: body.role,
      user: ctx.user._id
    });
    let mySet = new Set();
    for (let i = 0; i < dispatcherRole.length; i++) {
      let item = dispatcherRole[i];
      if (item.company) {
        mySet.add(item.company.toString());
      }
    }
    mySet.add(body.handle);
    companylist = [...mySet];
    let companyData = await ctx.model.Company.find({
      _id: {
        $in: companylist
      }
    });
    for (let i = 0; i < companyData.length; i++) {
      let item = JSON.parse(JSON.stringify(companyData[i]));
      let hasRole = await ctx.model.Role.findOne({
        company: item._id,
        type: body.role,
        user: ctx.user._id
      });
      if (hasRole) {
        let findBody = {
          state: {
            $nin: [5]
          },
          handle: item._id,
        };
        if (body.dispatcherManagerCheck !== undefined) {
          findBody.dispatcherManagerCheck = body.dispatcherManagerCheck;
        }
        if (body.logisticsClerkCheck !== undefined) {
          findBody.logisticsClerkCheck = body.logisticsClerkCheck;
        }
        if (body.checkFail) {
          findBody.checkFail = body.checkFail;
        }
        item.badge = await ctx.model.Logistics.count(findBody);
      }
      res.push(item);
    }
    return res;
  }
}
module.exports = LogisticsService;