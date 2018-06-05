const Service = require('egg').Service;
const orderField = require('../field/Order');

class OrderService extends Service {

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

  async badge() {
    const ctx = this.ctx;
    let state = orderField.state.option;
    let res = {};
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
          $in: [ctx.user._id]
        }
      })
    }

    for (const key in state) {
      let count = await ctx.model.Order.count({
        state: key,
        $or: $or
      });
      res[key] = count || 0;
    }
    return res;
  }
}
module.exports = OrderService;