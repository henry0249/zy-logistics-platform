const Service = require('egg').Service;
const orderField = require('../field/Order');
const areaPopulate = [{
  path: 'province'
}, {
  path: 'city'
}, {
  path: 'county'
}, {
  path: 'township'
}, {
  path: 'street'
}];

class OrderService extends Service {
  async stateChangeCheck(order,msg) {
    const ctx = this.ctx;
    let statePower = {
      taking: ['salesman', 'sysSalesman', 'beforeDispatchCheck'],
      beforeDispatchCheck: ['salesman', 'sysSalesman'],
      dispatch: ['beforeDispatchCheck'],
      distributionFinishCheck: ['dispatcher', 'sysDispatcher'],
      beforeSettleCheck: ['financial', 'documentClerk'],
      settle: ['beforeSettleCheck'],
      finish: ['financial', 'documentClerk']
    };
    return await ctx.service.check.role(statePower[order.state], order.handle._id || order.handle);
  }
  pendingRoleUserType(state) {
    let userType = {
      all: ['salesman', 'sysSalesman', 'beforeDispatchCheck', 'dispatcher', 'sysDispatcher', 'financial', 'documentClerk', 'beforeSettleCheck'],
      taking: ['salesman', 'sysSalesman'],
      beforeDispatchCheck: ['beforeDispatchCheck'],
      dispatch: ['dispatcher', 'sysDispatcher'],
      distribution: ['dispatcher', 'sysDispatcher'],
      distributionFinishCheck: ['financial', 'documentClerk'],
      beforeSettleCheck: ['beforeSettleCheck'],
      settle: ['financial', 'documentClerk']
    }
    return userType[state];
  }
  async getOrderInfo(payload) {
    const ctx = this.ctx;
    let info = JSON.parse(JSON.stringify(payload));
    for (const key in info) {
      if (info[key] && info[key]._id) {
        info[key] = info[key]._id
      }
    }
    if (!info) {
      ctx.throw(422, '订单信息未填', body);
    }
    if (!info.state) {
      ctx.throw(422, '未选择订单状态', info);
    }
    if (!orderField.state.option[info.state]) {
      ctx.throw(422, '非法的订单状态', info);
    }
    if (info.type === 'company' || info.type === 'user') {
      if (info.type === 'company') {
        delete info.user;
      }
      if (info.type === 'user') {
        delete info.company;
      }
      if (!info[info.type]) {
        ctx.throw(422, "未选择订单客户", info);
      }
    } else {
      ctx.throw(422, "未选择订单客户", info);
    }
    if (!info.contactName) {
      ctx.throw(422, '未填写收货人', info);
    }
    if (!info.contactNumber) {
      ctx.throw(422, '未填写收货人联系电话', info);
    }
    if (!info.area) {
      ctx.throw(422, '未选择送货地址', info);
    }
    if (!info.handle) {
      ctx.throw(422, '未指定供应商', info);
    }
    if (!info.goods) {
      ctx.throw(422, '未选择商品', info);
    }
    if (Number(info.count) <= 0) {
      ctx.throw(422, '商品数量必须大于0', info);
    }
    if (Number(info.factory) <= 0) {
      ctx.throw(422, '商品出厂单价必须大于0', info);
    }
    if (Number(info.sell) <= 0) {
      ctx.throw(422, '商品销售单价必须大于0', info);
    }
    if (Number(info.transport) <= 0) {
      ctx.throw(422, '商品运输单价必须大于0', info);
    }
    if (info._id) {
      let update = JSON.parse(JSON.stringify(info));
      await this.stateChangeCheck(update);
      console.log(update.state);
      delete update._id;
      delete update.createdAt;
      delete update.updatedAt;
      await ctx.model.Order.update({
        _id: info._id
      }, update);
      return await ctx.model.Order.findById(info._id);
    } else {
      info.state = 'taking';
      info.no = ctx.helper.no(info.goods, ctx.user._id, 1);
      let order = new ctx.model.Order(info);
      await order.save();
      return order;
    }
  }
  async setBusinessTrainsData(order, arr) {
    if (!(arr !== undefined && arr instanceof Array && arr.length > 0)) {
      return;
    }
    const ctx = this.ctx;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      for (const key in item) {
        if (item[key] && item[key]._id) {
          item[key] = item[key]._id
        }
      }
      item.order = order._id;
      if (item._id) {
        let update = JSON.parse(JSON.stringify(item));
        delete update._id;
        delete update.createdAt;
        delete update.updatedAt;
        await ctx.model.BusinessTrains.update({
          _id: item._id
        }, update);
      } else {
        let trains = new ctx.model.BusinessTrains(item);
        await trains.save();
      }
    }
  }
  async setTransportTrainsData(order, arr) {
    if (!(arr !== undefined && arr instanceof Array && arr.length > 0)) {
      return;
    }
    const ctx = this.ctx;
  }
  async set() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (body.state) {
      body.order.state = body.state;
    }
    let order = await this.getOrderInfo(body.order);
    await this.setBusinessTrainsData(order, body.businessTrains);
    await this.setTransportTrainsData(order, body.transportTrains);
    return 'ok';
  }
  async add() {
    return await this.set();
  }

  async transfer() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let order = await ctx.model.Order.findById(body.order);
    await order.update({
      handle: body.transferCompany
    });
    if (ctx.helper.is('array', body.businessTrains) && body.businessTrains.length > 0) {
      body.businessTrains[0].company = body.transferCompany;
      await this.setBusinessTrainsData(order, body.businessTrains);
    }
    return 'ok';
  }

  async badge() {
    const ctx = this.ctx;
    let state = orderField.state.option;
    let res = {};
    for (const key in state) {
      res[key] = await ctx.model.Order.count({
        state: key
      });
    }
    res.distribution = await ctx.model.Logistics.count({
      state: {
        $nin: [5]
      }
    });
    return res;
  }
  async companyBadge() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let res = [];
    let role = await ctx.model.Role.find({
      user: ctx.user._id,
    }).populate([{
      path: 'company'
    }]);
    let companySet = new Set();
    role.forEach(item => {
      companySet.add(item.company);
    });
    let company = [...companySet];
    for (let i = 0; i < company.length; i++) {
      let item = JSON.parse(JSON.stringify(company[i]));
      item.badge = await ctx.model.Order.count({
        state: body.state,
        handle: item._id
      });
      res.push(item);
    }

    function sortId(a, b) {
      return b.badge - a.badge;
    }
    res.sort(sortId);
    return res;
  }

  async pending() {
    const ctx = this.ctx;
    let params = ctx.params;
    let body = ctx.request.body || ctx.request.query;
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    let state = params.state;
    if (state === 'all') {
      state = {
        $exists: true
      }
    }
    let roleType = this.pendingRoleUserType(state);
    let role = await ctx.model.Role.find({
      type: {
        $in: roleType
      },
      user: ctx.user._id,
      company: body.handle
    });
    if (role.length === 0) {
      return [];
    }
    delete body.limit;
    delete body.skip;
    let orders = await ctx.model.Order.find({
      state: state,
      ...body
    }).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }, {
        path: 'company'
      }]
    }, {
      path: 'area',
      populate: areaPopulate
    }]).sort({
      updatedAt: -1
    }).limit(limit).skip(skip);
    return orders;
  }
  async getOrderById() {
    const ctx = this.ctx;
    let params = ctx.params;
    let order = await ctx.model.Order.findById(params._id).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'handle',
      populate: [{
        path: 'area',
        populate: areaPopulate
      }]
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }, {
        path: 'company'
      }]
    }, {
      path: 'area',
      populate: areaPopulate
    }]);
    if (!order) {
      ctx.throw(404, "未找到订单", params);
    }
    let res = JSON.parse(JSON.stringify(order));
    res.businessTrains = await ctx.model.BusinessTrains.find({
      order: order._id
    }).populate([{
      path: 'user'
    }, {
      path: 'company'
    }]);
    let transportTrains = await ctx.model.TransportTrains.find({
      order: res._id,
      goods: res.goods
    }).populate([{
      path: 'area',
      populate: areaPopulate
    }, {
      path: 'company'
    }, {
      path: 'user'
    }]);
    res.transportTrains = [];
    // let transportTrains = JSON.parse(JSON.stringify(transportTrainsData));
    for (let j = 0; j < transportTrains.length; j++) {
      let item = JSON.parse(JSON.stringify(transportTrains[j]));
      item.logistics = await ctx.model.Logistics.find({
        transportTrains: item._id,
        order: res._id
      }).populate([{
        path: 'truck'
      }, {
        path: 'ship'
      }]);
      res.transportTrains.push(item);
    }
    return res;
  }
}
module.exports = OrderService;