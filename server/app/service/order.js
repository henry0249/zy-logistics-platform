const Service = require('egg').Service;
const orderField = require('../field/Order');

class OrderService extends Service {
  orderFieldCheck(order) {
    const ctx = this.ctx;
    if (!order) {
      ctx.throw(422, '订单信息未填', body);
    }
    if (!order.company && !order.user) {
      ctx.throw(422, '未选择客户', body);
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
      if (!item.value) {
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
    this.orderFieldCheck(body.order);
    this.orderGoodsCheck(body.goods);
    let man = {
      salesman: [],
      dispatcher: [],
      documentClerk: [],
      financial: []
    };
    let order = {};
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
      order.state = 'dispatch';
    }
    order.creater = ctx.user._id;
    if (order.user && order.company) {
      ctx.throw(422, "下单客户不能同时为个人和公司", body);
    }
    let orderModel = new ctx.model.Order(order);
    await orderModel.save();
    for (let i = 0; i < body.goods.length; i++) {
      const goodsItem = body.goods[i];
      let goodsModel = new ctx.model.OrderGoods({
        ...goodsItem,
        order: orderModel._id,
        area: orderModel.area
      });
      await goodsModel.save();
    }
    return 'ok';
  }

  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    this.orderFieldCheck(body.order);
    if (body.goods instanceof Array && body.goods.length > 0) {
      this.orderGoodsCheck(body.goods);
    }
    if (!body.order._id) {
      ctx.throw(422, "订单编号必填", body);
    }
    let order = await ctx.model.Order.findById(body.order._id);
    if (!order) {
      ctx.throw(404, "未找到订单", body);
    }
    if (body.state !== undefined) {
      this.updateState(order);
    }
    delete body.order._id;
    await order.update(body.order);
    if (body.goods instanceof Array && body.goods.length > 0) {
      for (let i = 0; i < body.goods.length; i++) {
        let goodsItem = JSON.parse(JSON.stringify(body.goods[i]));
        if (!goodsItem._id) {
          ctx.throw(422, "商品编号必填", body);
        }
        delete goodsItem._id;
        await ctx.model.OrderGoods.update({
          _id: body.goods[i]._id
        }, goodsItem);
      }
    }
    return 'ok';
  }

  updateState(order) {
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
    if (newState === 'dispatch') {
      if (!ctx.helper.inArr(order.salesman, ctx.user._id)) {
        ctx.throw(403, `您无权限修改订单状态为【${newStateStr}】`, body);
      }
    }
    if (newState === 'distribution') {
      if (!ctx.helper.inArr(order.dispatcher, ctx.user._id)) {
        ctx.throw(403, `您无权限修改订单状态为【${newStateStr}】`, body);
      }
    }
    if (newState === 'transport') {
      if (!ctx.helper.inArr(order.dispatcher, ctx.user._id)) {
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
  }

  getOrderMan(user_id) {
    let inMan = {
      salesman: {

      },
      auditor: {

      },
      dispatcher: {

      },
      financial: {

      }
    }
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
      let count = await ctx.model.Order.count({
        state: key,
        $or: $or
      });
      res[key] = count || 0;
    }
    return res;
  }

  async pending() {
    const ctx = this.ctx;
    let params = ctx.params;
    let body = ctx.request.body || ctx.request.query;
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    let $or = this.getOrderMan(ctx.user._id);
    let orders = await ctx.model.Order.find({
      state: params.state,
      $or: $or
    }).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'area'
    }]).limit(limit).skip(skip);
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
      populate: [{
        path: 'province'
      }, {
        path: 'city'
      }, {
        path: 'county'
      }, {
        path: 'township'
      }, {
        path: 'street'
      }]
    }]);
    if (!order) {
      ctx.throw(404, "未找到订单", params);
    }
    let res = JSON.parse(JSON.stringify(order));
    res.goods = await ctx.model.OrderGoods.find({
      order: res._id
    }).populate([{
      path: 'value',
      populate: [{
        path: 'mfrs'
      }]
    }]);
    return res;
  }
}
module.exports = OrderService;