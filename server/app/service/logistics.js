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
    let hasRole = await ctx.model.Role.findOne({
      type: {
        $in: ['dispatcher', 'dispatcherManager', 'logisticsClerk']
      }
    });
    if (!hasRole) {
      ctx.throw(400, "您无权限操作", body);
    }
    this.obj2id(body);
    if (body.transportation === 'truck') {
      delete body.ship;
    }
    if (body.transportation === 'ship') {
      delete body.truck;
    }
    if (Number(body.state) === 5) {
      if (!(!logistics.checkFail && logistics.dispatcherManagerCheck && logistics.logisticsClerkCheck)) {
        ctx.throw(400, "该物流单尚未审核完成", body);
      }
    }
    if (Number(body.landed) > Number(body.loading)) {
      ctx.throw(422, '卸货量不能大于装货量', body);
    }
    if (Number(body.loss) > Number(body.loading)) {
      ctx.throw(422, '损耗数量不能大于装货量', body);
    }
    if (Number(body.balanceCount) > Number(body.loading)) {
      ctx.throw(422, '结算数量不能大于装货量', body);
    }
    if (Number(body.state) > 0) {
      if (!body[body.transportation]) {
        ctx.throw(422, '车/船 信息未完善', body);
      }
    }
    if (Number(body.state) > 1 && Number(body.loading) <= 0) {
      ctx.throw(422, '装货量必须大于0', body);
    }
    if (Number(body.state) > 1 && Number(body.landed) <= 0) {
      ctx.throw(422, '卸货量必须大于0', body);
    }
    if (Number(body.state) > 1 && Number(body.price) <= 0) {
      ctx.throw(422, '运费单价必须大于0', body);
    }
    delete body._id;
    delete body.updatedAt;
    delete body.createdAt;
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
          checkFail: '',
          price: {
            $gt: 0
          },
          $or: [{
            ship: {
              $exists: true
            }
          }, {
            truck: {
              $exists: true
            }
          }]
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
    if (!logistics[logistics.transportation]) {
      ctx.throw(422, "车 / 船信息尚未完善", body);
    }
    if (Number(logistics.price) <= 0) {
      ctx.throw(422, "运费单价必须大于0", body);
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

  async handleTab() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    let companyData = await ctx.service.role.getAllRoleCompany('dispatcher', true);
    let res = [];
    for (let i = 0; i < companyData.length; i++) {
      let item = JSON.parse(JSON.stringify(companyData[i]));
      item.listType = 'carrier';
      item.count = await ctx.model.TransportTrains.count({
        finish: false,
        carrierCompany: item._id,
        next: {
          $exists: true
        }
      });
      res.push(item);
    }
    let transportTrainsData = await ctx.model.TransportTrains.findOne({
      finish: false,
      handle: req.company,
      carrierCompany: {
        $exists: false
      },
      next: {
        $exists: true
      }
    });
    if (transportTrainsData) {
      let count = await ctx.model.TransportTrains.count({
        finish: false,
        handle: req.company,
        carrierCompany: {
          $exists: false
        },
        next: {
          $exists: true
        }
      });
      res.push({
        _id: req.company,
        listType: 'handle',
        name: '未分配承运公司物流节点',
        count
      });
    }
    return res;
  }
  async handleList() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    let listType = req.listType || 'carrier';
    if (['carrier', 'handle'].indexOf(listType) < 0) ctx.throw(422, '无效的列表类型');
    let res = [];
    let findBody = {
      finish: false,
      next: {
        $exists: true
      }
    };
    if (listType === 'carrier') {
      findBody.carrierCompany = req.company;
    }
    if (listType === 'handle') {
      findBody.handle = req.company;
      findBody.carrierCompany = {
        $exists: false
      }
    }
    let limit = req.limit !== undefined ? Number(req.limit) : 10;
    let skip = req.skip !== undefined ? Number(req.skip) : 0;
    let transportTrainsData = await ctx.model.TransportTrains
      .find(findBody)
      .populate([{
        path: 'goods'
      }, {
        path: 'order'
      }, {
        path: 'carrierCompany'
      }])
      .limit(limit)
      .skip(skip);
    for (let i = 0; i < transportTrainsData.length; i++) {
      let item = JSON.parse(JSON.stringify(transportTrainsData[i]));
      item.logisticsCount = await ctx.model.Logistics.count({
        transportTrains: item._id
      });
      res.push(item);
    }
    return res;
  }
}
module.exports = LogisticsService;