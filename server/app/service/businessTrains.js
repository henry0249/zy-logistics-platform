const Service = require('egg').Service;
const businessTrainsField = require('../field/BusinessTrains');

class BusinessTrainsService extends Service {
  getModelBody(param) {
    const ctx = this.ctx;
    let req = param;
    if (!req) return;
    if (!businessTrainsField.type.option[req.type]) ctx.throw(422, '贸易节点类型错误', req);
    if (req.type === 'customer') {
      if (!businessTrainsField.customerType.option[req.customerType]) ctx.throw(422, '客户类型不合法', req);
      if (req.customerType === 'user' && !req.user) ctx.throw(422, '下单用户获取失败', req);
      if (req.customerType === 'company' && !req.company) ctx.throw(422, '下单公司获取失败', req);
    } else {
      if (req.type === 'supplier' && !req.company) ctx.throw(422, '供货商公司信息未填', req);
      if (req.type === 'pool' && !req.company) ctx.throw(422, '联营商公司信息未填', req);
    }
    if (!req.order) ctx.throw(422, '贸易节点订单信息获取失败', req);
    if (!req.goods) ctx.throw(422, '贸易节点商品信息获取失败', req);
    if (!req.handle) ctx.throw(422, '贸易节点处理公司获取失败', req);
    let modelBody = {
      type: req.type,
      order: req.order,
      goods: req.goods,
      handle: req.handle,
      receive: req.receive,
      loss: req.loss,
      preBalancePrice: req.preBalancePrice,
      balancePrice: req.balancePrice,
      balanceCount: req.balanceCount,
      preSettlement: req.preSettlement,
      prePrepaid: req.prePrepaid,
      preInvoiced: req.preInvoiced
    };
    if (req.type === 'customer') {
      modelBody.customerType = req.customerType;
      if (req.customerType === 'user') {
        modelBody.user = req.user;
        modelBody.balanceType = 'user';
        modelBody.balanceUser = req.user;
      } else {
        modelBody.company = req.company;
        modelBody.balanceType = 'company';
        modelBody.balanceCompany = req.company;
      }
    } else {
      if (req.supplyCount <= 0) ctx.throw(422, '供货数量不能小于0', req);
      if (req.supplyPrice <= 0) ctx.throw(422, '供货价格不能小于0', req);
      modelBody.company = req.company;
      modelBody.balanceType = 'company';
      modelBody.balanceCompany = req.company;
      modelBody.supplyCount = req.supplyCount;
      modelBody.supplyPrice = req.supplyPrice;
    }
    return modelBody;
  }

  async set(param, last) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req) return {};
    let modelBody = this.getModelBody(req);
    if (!modelBody) return {};
    if (last) {
      if (last.type === 'supplier' || last.type === 'pool') {
        modelBody.receivedType = 'company';
        modelBody.receivedCompany = last.balanceCompany;
      }
    }
    if (req._id) {
      await ctx.model.BusinessTrains.update({
        _id: req._id
      }, modelBody);
      return await ctx.model.BusinessTrains.findById(req._id);
    } else {
      let businessTrains = new ctx.model.BusinessTrains(modelBody);
      await businessTrains.save();
      return businessTrains;
    }
  }

  async update(param, last) {
    return await this.set(param, last);
  }

  async add(param, last) {
    await this.set(param, last);
  }

  async mutilSet(param, orderInfo) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req) ctx.throw(422, '贸易链尚未添加', req);
    if (!(req instanceof Array)) ctx.throw(422, '贸易链必须是数组', req);
    if (req.length < 2) ctx.throw(422, '贸易链至少两个节点', req);
    if (!orderInfo) ctx.throw(422, '贸易节点订单信息获取失败', req);
    if (!orderInfo._id) ctx.throw(422, '贸易节点订单信息获取失败', req);
    if (!orderInfo.goods) ctx.throw(422, '贸易节点商品信息获取失败', req);
    if (!orderInfo.handle) ctx.throw(422, '贸易节点处理公司获取失败', req);
    let hasHandle = false;
    let companySet = new Set();
    for (let i = 0; i < req.length; i++) {
      let item = req[i];
      if (i === 0) {
        item.type = 'supplier';
      } else if (i === req.length - 1) {
        item.type = 'customer';
        item.customerType = orderInfo.type;
      } else {
        item.type = 'pool';
      }
      if (item.company && companySet.has(item.company)) ctx.throw(422, '贸易链不能含有重复公司', req);
      companySet.add(item.company);
      if (item.company === orderInfo.handle.toString()) hasHandle = true;
      item.order = orderInfo._id;
      item.handle = orderInfo.handle;
      item.goods = orderInfo.goods;
    }
    if (!hasHandle) ctx.throw(422, '未包含当前处理公司', req);
    let res = [],
      res_id = [];
    for (let i = 0; i < req.length; i++) {
      let item = this.getModelBody(req[i]);
      if (req[i]._id) item._id = req[i]._id;
      let last;
      if (i > 0) last = this.getModelBody(req[i - 1]);
      let data = await this.set(item, last);
      res_id.push(data._id);
      res.push(data);
    }
    for (let i = 0; i < res.length; i++) {
      let item = res[i];
      let last, next;
      if (i === 0) {
        next = res[i + 1];
      } else if (i === res.length - 1) {
        last = res[i - 1];
      } else {
        last = res[i - 1];
        next = res[i + 1];
      }
      let update = {};
      if (last) update.last = last._id;
      if (next) update.next = next._id;
      await ctx.model.BusinessTrains.update({
        _id: item._id
      }, update);
      if (!next) continue;

      //增加account关联
      let accountBody = {
        company: item.company,
        type: 'company',
        relationType: 'company',
        relationCompany: next.company
      };
      if (next.customerType === 'user') {
        accountBody = {
          company: item.company,
          type: 'user',
          relationType: 'user',
          relationUser: next.user
        }
      }
      await ctx.service.account.set(accountBody);

      //增加库存单关联
      let date = ctx.helper.formatTime(new Date(), "YYYY年MM月DD日A");
      date = date.replace("AM", "上午");
      date = date.replace("PM", "下午");
      let stockBody = {
        type: 'out',
        company: item.company,
        order: item.order,
        businessTrains: item._id,
        name: '贸易链产生出库单 ' + date,
        goods: item.goods,
        num: item.supplyCount
      };
      if (next.customerType === 'user') {
        stockBody.toType = 'user';
        stockBody.toUser = next.user;
      } else {
        stockBody.toType = 'company';
        stockBody.toCompany = next.company;
      }
      await ctx.service.stock.set(stockBody);
    }
    await ctx.model.Order.update({
      _id: orderInfo._id
    }, {
      businessTrains: res_id
    });
    return res_id;
  }

  async delete() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    if (!body._id) ctx.throw(422, '删除参数不完整', body);
    await ctx.service.curd.delete(ctx.model.BusinessTrains, {
      _id: body._id
    });
    await ctx.service.curd.delete(ctx.model.Stock, {
      businessTrains: body._id,
      multi: true,
      check: false
    });
    return 'ok';
  }
  async updateBalancePrice(param, justCheck) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw('贸易节点信息获取失败');
    if (!(req.balancePrice !== undefined && Number(req.balancePrice) > 0)) ctx.throw('结算价格必须大于0');
    if (justCheck) return;
    await ctx.model.BusinessTrains.update({
      _id: req._id
    }, {
      balancePrice: item.balancePrice
    });
    return 'ok';
  }
  async mutilUpdateBalancePrice(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req && req instanceof Array && req.length > 0));
    for (const item of req) {
      await this.updateBalancePrice(item, true);
    }
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      await this.updateBalancePrice(item);
    }
    return 'ok';
  }

}
module.exports = BusinessTrainsService;