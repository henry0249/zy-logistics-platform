const Service = require('egg').Service;
const orderField = require('../field/Order');

class OrderService extends Service {
  async set() {
    return await this.add();
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.order) {
      ctx.throw(422, '订单信息未填', body);
    }
    if (!ctx.helper.is('array', body.goods)) {
      ctx.throw(422, '商品信息未填', body);
    }
    let order = body.order;
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
    let goodsCheck = true;
    body.goods.forEach(item => {
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
    let man = {
      salesman: [],
      auditor: [],
      dispatcher: [],
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
    order.state = 'taking';
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
      path: 'value'
    }]);
    return res;
  }
}
module.exports = OrderService;