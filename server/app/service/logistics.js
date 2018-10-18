const Service = require('egg').Service;
const logisticsField = require('../field/Logistics');
const roleList = ['sysDispatcher', 'dispatcher', 'logisticsClerk', 'dispatcherManager'];

class LogisticsService extends Service {
  obj2id(obj) {
    for (const key in obj) {
      if (JSON.stringify(obj[key]) === '{}') {
        delete obj[key];
      }
      if (obj[key] === '' || obj[key] === null) {
        delete obj[key];
      }
      if (obj[key] && obj[key]._id) {
        obj[key] = obj[key]._id;
      }
    }
    return obj;
  }
  async find() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
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
    let populate = body.populate || [{
      path: 'ship'
    }, {
      path: 'truck'
    }, {
      path: 'truck'
    }, {
      path: 'balanceCompany'
    }, {
      path: 'lossCompany'
    }];
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
    this.obj2id(body);
    body.checkFail = '';
    await logistics.update(body);
    return 'ok';
  }
  async companyBadge() {
    const ctx = this.ctx;
    let body = ctx.request.body;
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
          checkFail: ''
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
  async check() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.logistics) {
      ctx.throw(422, "物流单信息未找到", body);
    }
    if (!body.role || roleList.indexOf(body.role) < 0) {
      ctx.throw(422, "无操作权限", body);
    }
    let logistics = await ctx.model.Logistics.findById(body.logistics);
    if (!logistics) {
      ctx.throw(404, "物流单信息未找到", body);
    }
    let role = "";
    if (body.role === 'dispatcherManager' || body.role === 'logisticsClerk') {
      role = await ctx.model.Role.findOne({
        type: body.role,
        user: ctx.user._id
      });
    } else {
      ctx.throw(422, "无操作权限", body);
    }
    if (!role) {
      ctx.throw(422, "无操作权限", body);
    }
    if (role.type === 'dispatcherManager') {
      if (logistics.dispatcherManagerCheck) {
        ctx.throw(422, "该物流单已经被审核,请勿重复审核", body);
      }
      await logistics.update({
        dispatcherManagerCheck: true,
        logisticsClerkCheck: false,
        checkFail: ''
      });
    }
    if (role.type === 'logisticsClerk') {
      if (logistics.logisticsClerkCheck) {
        ctx.throw(422, "该物流单已经被审核,请勿重复审核", body);
      }
      await logistics.update({
        dispatcherManagerCheck: true,
        logisticsClerkCheck: true,
        checkFail: ''
      });
    }
    return 'ok';
  }
  async checkFail() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.logistics) {
      ctx.throw(422, '物流单信息未找到');
    }
    if (!body.role || ['dispatcherManager', 'logisticsClerk'].indexOf(body.role) < 0) {
      ctx.throw(422, "无操作权限", body);
    }
    let logistics = await ctx.model.Logistics.findById(body.logistics);
    if (!logistics) {
      ctx.throw(404, '物流单信息未找到');
    }
    let hasRolePower = await ctx.model.Role.findOne({
      type: body.role,
      user: ctx.user._id,
      company: logistics.handle
    });
    if (!hasRolePower) {
      ctx.throw(422, '您无权限审核');
    }
    if (!body.text) {
      ctx.throw(422, '审核失败原因必填');
    }
    await logistics.update({
      [body.role]: false,
      checkFail: body.role
    });
    let curdLog = new ctx.model.CurdLog({
      type: 'logisticsCheckFail',
      user: ctx.user._id,
      company: logistics.handle,
      logistics: logistics._id,
      remark: body.text
    });
    await curdLog.save();
    return 'ok';
  }
}
module.exports = LogisticsService;