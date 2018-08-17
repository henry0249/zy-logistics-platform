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
  async statePowerCheck(msg) {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let statePower = {
      taking: ['salesman', 'sysSalesman', 'dispatchCheck'],
      beforeDispatchCheck: ['salesman', 'sysSalesman'],
      dispatch: ['dispatchCheck'],
      beforeSettleCheck: ['dispatcher', 'sysDispatcher'],
      settle: ['financial', 'documentClerk', 'finishCheck'],
      finish: ['finishCheck']
    };
    return await ctx.service.check.role(statePower[body.state], body.roleCompany);
  }
  async opUser() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let user = {
      taking: ['salesman', 'sysSalesman'],
      beforeDispatchCheck: ['dispatchCheck'],
      dispatch: ['dispatcher', 'sysDispatcher'],
      beforeSettleCheck: ['financial', 'documentClerk'],
      settle: ['finishCheck'],
      finish: ['financial', 'documentClerk']
    }
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
      ctx.throw(422, '未指定生产厂商', info);
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
      if (info.state) {}
      let update = JSON.parse(JSON.stringify(info));
      delete update._id;
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
    const ctx = this.ctx;
    if (!(arr !== undefined && arr instanceof Array && arr.length > 0)) {
      return;
    }
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
        await ctx.model.BusinessTrains.update({
          _id: item._id
        }, update);
      } else {
        let trains = new ctx.model.BusinessTrains(item);
        await trains.save();
      }
    }
  }
  async set() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let order = await this.getOrderInfo(body.order);
    await this.setBusinessTrainsData(order, body.businessTrains);
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

  async dispatch() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.order) {
      ctx.throw(422, "订单编号必填", body);
    }
    let transportTrains = body.transportTrains;
    if (!(transportTrains && transportTrains.length > 0)) {
      ctx.throw(422, "物流链信息必填", body);
    }
    let order = await ctx.model.Order.findById(body.order);
    if (!order) {
      ctx.throw(404, "订单不存在", body);
    }
    if (order.state !== 'dispatch') {
      ctx.throw(403, "此订单已经完成调度", body);
    }
    if (body.removeTrains instanceof Array && body.removeTrains.length > 0) {
      for (let i = 0; i < body.removeTrains.length; i++) {
        if (body.removeTrains[i]._id) {
          await ctx.model.TransportTrains.remove({
            _id: body.removeTrains[i]._id
          })
        }
      }
    }
    if (body.removeLogistics instanceof Array && body.removeLogistics.length > 0) {
      for (let i = 0; i < body.removeLogistics.length; i++) {
        if (body.removeLogistics[i]._id) {
          await ctx.model.Logistics.remove({
            _id: body.removeLogistics[i]._id
          })
        }
      }
    }
    for (let i = 0; i < transportTrains.length; i++) {
      let item = transportTrains[i];
      if (!(item.logistics instanceof Array && item.logistics.length > 0)) {
        ctx.throw(422, "运单数量不能为0", body);
      }
      let transportTrains_id;
      let $unset = {};
      if (!item.origin) {
        $unset.origin = 1;
      }
      if (!item.transfer) {
        $unset.transfer = 1;
      }
      if (!item.transfer2) {
        $unset.transfer2 = 1;
      }
      if (!item.destination) {
        $unset.destination = 1;
      }
      if (item._id) {
        transportTrains_id = item._id;
        delete item._id;
        await ctx.model.TransportTrains.update({
          _id: transportTrains_id
        }, { ...item,
          $unset: $unset
        });
      } else {
        let transportTrainsModel = new ctx.model.TransportTrains(item);
        await transportTrainsModel.save();
        transportTrains_id = transportTrainsModel._id;
      }
      for (let j = 0; j < item.logistics.length; j++) {
        let lg = item.logistics[j];
        if (lg.state > 0 && !(lg.truck || lg.ship)) {
          ctx.throw(422, "接单后必须填写车船信息", body);
        }
        lg.transportTrains = transportTrains_id;
        delete lg.ts;
        if (lg._id) {
          let logistics_id = lg._id;
          delete lg._id;
          await ctx.model.Logistics.update({
            _id: logistics_id
          }, {
            ...lg,
            $unset: $unset
          });
        } else {
          lg.no = ctx.helper.no(lg.goods, ctx.user._id, '6');
          let logisticsModel = new ctx.model.Logistics(lg);
          await logisticsModel.save();
        }
      }
    }
    return 'ok';
  }
  async updateState(order) {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let newState = body.state;
    let newStateStr = orderField.state.option[newState];

    if (!newStateStr) {
      ctx.throw(422, "无效的订单状态", body);
    }
    if (newState === order.state) {
      ctx.throw(405, `订单已经是【${newStateStr}】，请勿重复修改`, body);
    }
    if (newState === 'dispatchCheck') {
      if (!ctx.helper.inArr(order.salesman, ctx.user._id)) {
        ctx.throw(403, `您无权限修改订单状态为【${newStateStr}】`, body);
      }
    }
    if (newState === 'dispatch') {
      if (!ctx.helper.inArr(order.dispatchCheck, ctx.user._id)) {
        ctx.throw(403, `您无权限修改订单状态为【${newStateStr}】`, body);
      }
    }
    if (newState === 'check') {
      if (!ctx.helper.inArr(order.dispatcher, ctx.user._id)) {
        ctx.throw(403, `您无权限修改订单状态为【${newStateStr}】`, body);
      }
    }
    if (newState === 'finish') {
      if (!ctx.helper.inArr(order.financial, ctx.user._id)) {
        ctx.throw(403, `您无权限修改订单状态为【${newStateStr}】`, body);
      }
    }
    if (newState === 'check') {
      let hasLogistics = await ctx.model.Logistics.findOne();
      if (!hasLogistics) {
        ctx.throw(404, `该订单尚未添加任何物流运输单`, body);
      }
      let logistics = await ctx.model.Logistics.findOne({
        order: order._id,
        state: {
          $in: [0, 1, 2, 3, 4]
        }
      });
      if (logistics) {
        ctx.throw(403, `该订单存在尚未完成的物流运输单`, body);
      }
    }
    await ctx.model.Order.update({
      _id: order._id
    }, {
      state: newState
    });
  }

  getOrderMan(user_id) {
    let inMan = {
      salesman: {

      },
      dispatcher: {

      },
      documentClerk: {

      },
      financial: {

      }
    };
    let $or = [];
    for (const key in inMan) {
      $or.push({
        [key]: {
          $in: [user_id]
        }
      })
    }
    return $or;
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
    let company = await ctx.model.Company.find();
    for (let i = 0; i < company.length; i++) {
      let item = JSON.parse(JSON.stringify(company[i]));
      item.badge = await ctx.model.Order.count({
        state: body.state,
        handle: item._id
      });
      // if (item.badge>0) {
      res.push(item);
      // }
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
        path: 'mfrs'
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