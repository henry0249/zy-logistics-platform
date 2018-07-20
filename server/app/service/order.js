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
  orderFieldCheck(order) {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!order) {
      ctx.throw(422, '订单信息未填', body);
    }
    if (!order.company && !order.user) {
      ctx.throw(422, '未选择客户', body);
    }
    if (order.user && order.company) {
      ctx.throw(422, "下单客户不能同时为个人和公司", body);
    }
    if (!order.contactName) {
      ctx.throw(422, '未填写收货人', body);
    }
    if (!order.contactNumber) {
      ctx.throw(422, '未填写收货人联系电话', body);
    }
    if (!order.area) {
      ctx.throw(422, '未选择送货地址', body);
    }
  }
  orderGoodsCheck(goods) {
    const ctx = this.ctx;
    let goodsCheck = true;
    if (goods instanceof Array && goods.length > 0) {} else {
      goodsCheck = '未选择商品';
    }
    goods.forEach(item => {
      if (!(item.value && item.value._id)) {
        goodsCheck = '未选择商品';
        return;
      }
      if (!ctx.helper.is('number', Number(item.count)) || Number(item.count) <= 0) {
        goodsCheck = '商品数量不正确';
        return;
      }
      if (!ctx.helper.is('number', Number(item.factoryPrice)) || Number(item.factoryPrice) <= 0) {
        goodsCheck = '出厂价格不正确';
        return;
      }
      if (!ctx.helper.is('number', Number(item.unitPrice)) || Number(item.unitPrice) <= 0) {
        goodsCheck = '销售单价不正确';
        return;
      }
      if (!ctx.helper.is('number', Number(item.transportPrice)) || Number(item.transportPrice) <= 0) {
        goodsCheck = '运输单价不正确';
        return;
      }
    });
    if (goodsCheck !== true) {
      ctx.throw(422, goodsCheck, body);
    }
  }
  async set() {
    return await this.add();
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let order = body.order;
    this.orderFieldCheck(order);
    this.orderGoodsCheck(body.goods);
    let man = {
      salesman: [],
      dispatcher: [],
      documentClerk: [],
      financial: []
    };
    if (ctx.tokenData.sys === 'cms') {
      function setMan(type) {
        if (ctx[type]) {
          for (const key in man) {
            man[key] = ctx[type][key] || [];
            if (man[key].length === 0) {
              let adminSet = new Set(ctx.helper.idArr(ctx[type].admin));
              if (ctx[type].owner) {
                adminSet.add(ctx[type].owner.toString());
              }
              man[key] = [...adminSet];
            }
          }
        }
      }
      setMan('company');
      setMan('platform');
      let salesmanSet = new Set(man.salesman);
      if (!salesmanSet.has(ctx.user._id.toString())) {
        ctx.throw(403, '您无权限创建订单', body);
      }
      for (const key in man) {
        order[key] = man[key];
      }
    }
    order.creater = ctx.user._id;
    let orderModel = new ctx.model.Order(order);
    await orderModel.save();
    let goods_id;
    for (let i = 0; i < body.goods.length; i++) {
      const goodsItem = body.goods[i];
      let goodsModel = new ctx.model.OrderGoods({
        ...goodsItem,
        value: goodsItem.value._id,
        order: orderModel._id,
        area: orderModel.area
      });
      await goodsModel.save();
      goods_id = goodsModel._id;
    }
    await ctx.model.Order.update({
      _id: orderModel._id
    }, {
      no: ctx.helper.no(goods_id, ctx.user._id)
    })
    return 'ok';
  }

  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let _id = body.order._id;
    delete body.order._id;
    if (!ctx.helper.is('empty', body.order)) {
      this.orderFieldCheck(body.order);
    }
    if (body.goods instanceof Array && body.goods.length > 0) {
      this.orderGoodsCheck(body.goods);
    }
    if (!_id) {
      ctx.throw(422, "订单编号必填", body);
    }
    let order = await ctx.model.Order.findById(_id);
    if (!order) {
      ctx.throw(404, "未找到订单", body);
    }
    if (body.state !== undefined) {
      await this.updateState(order);
    }
    if (!ctx.helper.is('empty', body.order)) {
      await order.update(body.order);
    }
    if (body.goods instanceof Array && body.goods.length > 0) {
      for (let i = 0; i < body.goods.length; i++) {
        let goodsItem = JSON.parse(JSON.stringify(body.goods[i]));
        if (!goodsItem._id) {
          ctx.throw(422, "商品编号必填", body);
        }
        delete goodsItem._id;
        goodsItem.value = goodsItem.value._id; 
        await ctx.model.OrderGoods.update({
          _id: body.goods[i]._id
        }, goodsItem);
      }
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
    let $or = this.getOrderMan(ctx.user._id);
    for (const key in state) {
      res[key] = await ctx.model.Order.count({
        state: key,
        $or: $or
      });
    }
    res.distribution = await ctx.model.Logistics.count({
      state: {
        $nin: [5]
      }
    });
    return res;
  }

  async pending() {
    const ctx = this.ctx;
    let params = ctx.params;
    let body = ctx.request.body || ctx.request.query;
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    let $or = this.getOrderMan(ctx.user._id);
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
      $or: $or,
      ...body
    }).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'area',
      populate: areaPopulate
    }]).sort({
      updatedAt: -1
    }).limit(limit).skip(skip);
    let res = [];
    for (let i = 0; i < orders.length; i++) {
      let orderItem = JSON.parse(JSON.stringify(orders[i]));
      orderItem.goods = await ctx.model.OrderGoods.find({
        order: orderItem._id
      }).populate([{
        path: 'value'
      }]);
      res.push(orderItem);
    }
    return res;
  }
  async getOrderById() {
    const ctx = this.ctx;
    let params = ctx.params;

    let order = await ctx.model.Order.findById(params._id).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'area',
      populate: areaPopulate
    }]);
    if (!order) {
      ctx.throw(404, "未找到订单", params);
    }
    let res = JSON.parse(JSON.stringify(order));
    let goodsData = await ctx.model.OrderGoods.find({
      order: res._id
    }).populate([{
      path: 'value',
      populate: [{
        path: 'mfrs',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'brand'
      }]
    }])
    res.goods = JSON.parse(JSON.stringify(goodsData));
    for (let i = 0; i < res.goods.length; i++) {
      let goodsItem = res.goods[i];
      let transportTrainsData = await ctx.model.TransportTrains.find({
        order: res._id,
        goods: goodsItem.value._id
      }).populate([{
        path: 'origin',
        populate: areaPopulate
      }, {
        path: 'transfer',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'transfer2',
        populate: areaPopulate,
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'destination',
        populate: areaPopulate
      }]);
      let transportTrains = JSON.parse(JSON.stringify(transportTrainsData));
      for (let j = 0; j < transportTrains.length; j++) {
        let item = transportTrains[j];
        item.logistics = await ctx.model.Logistics.find({
          transportTrains: item._id,
          order: res._id,
          goods: goodsItem.value._id
        }).populate([{
          path: 'truck'
        }, {
          path: 'ship'
        }]);
      }
      goodsItem.transportTrainsData = transportTrains;
    }
    return res;
  }
}
module.exports = OrderService;