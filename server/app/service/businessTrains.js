const Service = require('egg').Service;
const businessTrainsField = require('../field/BusinessTrains');

class BusinessTrainsService extends Service {
  getModelBody(param) {
    const ctx = this.ctx;
    let req = param;
    if (!req) return;
    if (!businessTrainsField.type.option[req.type]) ctx.throw(422, '贸易节点错误', req);
    if (req.type === 'customer') {
      if (!businessTrainsField.type.option[req.customerType]) ctx.throw(422, '客户类型不合法', req);
      if (req.customerType === 'user' && !req.user) ctx.throw(422, '下单用户获取失败', req);
      if (req.customerType === 'company' && !req.company) ctx.throw(422, '下单公司获取失败', req);
    } else {
      if (req.type === 'supplier' && !req.company) ctx.throw(422, '供货商公司信息未填', req);
      if (req.type === 'pool' && !req.company) ctx.throw(422, '联营商公司信息未填', req);
    }
    if (!req.order) ctx.throw(422, '贸易节点订单信息获取失败', req);
    if (!req.goods) ctx.throw(422, '贸易节点商品信息获取失败', req);
    if (!req.handle) ctx.throw(422, '贸易节点处理公司获取失败', req);
    if (req.type === 'customer') {
      if (req.customerType === 'user') {
        req.balanceType = 'user';
        req.balanceUser = req.user;
      } else {
        req.balanceType = 'company';
        req.balanceCompany = req.company;
      }
    } else {
      req.balanceType = 'company';
      req.balanceCompany = req.company;
    }
    let modelBody = {
      customerType: req.customerType,
      type: req.type,
      order: req.order,
      goods: req.goods,
      handle: req.handle,
      balanceType: req.balanceType,
      receive: req.receive,
      loss: req.loss,
      preBalancePrice: req.preBalancePrice,
      balancePrice: req.balancePrice,
      balanceCount: req.balanceCount,
      preSettlement: req.preSettlement,
      prePrepaid: req.prePrepaid,
      preInvoiced: req.preInvoiced
    };
    if (req._id) modelBody._id = req._id;
    if (req.balanceUser) modelBody.balanceUser = req.balanceUser;
    if (req.balanceCompany) modelBody.balanceCompany = req.balanceCompany;
    if (req.type === 'supplier' || req.type === 'pool') {
      if (req.supplyCount <= 0) ctx.throw(422, '供货数量不能小于0', req);
      if (req.supplyPrice <= 0) ctx.throw(422, '供货价格不能小于0', req);
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
    if (modelBody._id) {
      let update = JSON.parse(JSON.stringify(modelBody));
      delete update._id;
      await ctx.model.BusinessTrains.update({
        _id: modelBody._id
      }, update);
      return modelBody;
    } else {
      let businessTrains = new ctx.model.BusinessTrains(modelBody);
      await businessTrains.save();
      return businessTrains;
    }
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
    if (req.length < 2) ctx.throw(422, '贸易链至少两个节点', req);
    if (!orderInfo) ctx.throw(422, '贸易节点订单信息获取失败', req);
    if (!orderInfo._id) ctx.throw(422, '贸易节点订单信息获取失败', req);
    if (!orderInfo.goods) ctx.throw(422, '贸易节点商品信息获取失败', req);
    if (!orderInfo.handle) ctx.throw(422, '贸易节点处理公司获取失败', req);
    let res = [];
    for (let i = 0; i < req.length; i++) {
      let item = req[i];
      if (i === 0) {
        item.type = 'supplier';
      } else if (i === req.length - 1) {
        item.type = 'customer';
      } else {
        item.type = 'pool';
      }
      item.order = orderInfo._id;
      item.handle = orderInfo.handle;
      item.goods = orderInfo.goods;
    }
    for (let i = 0; i < req.length; i++) {
      let item = this.getModelBody(req[i]);
      let last;
      if (i > 0) {
        last = this.getModelBody(req[i - 1]);
      }
      let data = await this.set(item, last);
      res.push(data._id);
    }
    for (let i = 0; i < res.length; i++) {
      let item = res[i];
      let update = {};
      if (i === 0) {
        update.next = res[i + 1];
      } else if (i === res.length - 1) {
        update.last = res[i - 1];
      } else {
        update.last = res[i - 1];
        update.next = res[i + 1];
      }
      await ctx.model.BusinessTrains.update({
        _id: item
      }, update);
      if (update.next) {
        let accountBody = {
          type: 'company',
          relationType:'company',
          relationCompany: update.next.company
        };
        if (update.next.customerType && update.next.customerType === 'user') {
          accountBody = {
            type:'user',
            relationType:'user',
            relationUser: update.next.user
          }
        }
        await ctx.service.account.set(accountBody)
      }
    }
    await ctx.model.Order.update({
      _id: orderId
    }, {
      businessTrains: res
    });
    return res;
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
      state: 'ready'
    });
    return 'ok';
  }
  async multiUpdateCheck(body) {
    const ctx = this.ctx;
    let newState = body.newSettleState;
    if (!body.company) ctx.throw(422, '公司信息必填', body);
    if (!businessTrainsField.settleState.option[newState]) ctx.throw(422, '非法的状态', body);
    let businessTrains = body.businessTrains || [];
    if (businessTrains.length === 0) ctx.throw(422, '尚未选择', body);
    let company = await ctx.model.Company.findById(body.company);
    if (!company) ctx.throw(404, '公司信息未找到', body);
  }
  async multiUpdate() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    await this.multiUpdateCheck(body);
    let newState = body.newSettleState;
    let account;
    if (newState === 'financialManager' || newState === 'finish') {
      if (!body.account) ctx.throw(422, '账户信息获取失败', body);
      account = await ctx.model.Account.findById(body.account);
      if (!account) ctx.throw(404, '账户不存在', body);
    }
    let roleType = {
      settle: 'financial',
      financialManager: 'settle',
      finish: 'financialManager'
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: body.company,
      type: roleType[newState]
    });
    if (!hasRole) ctx.throw(400, '您无操作权限', body);

    let businessTrains = body.businessTrains;
    let preSettlementCount = 0;
    let prePrepaidCount = 0;
    businessTrains.forEach((item) => {
      let balanceTotal =
        item.balancePrice * item.balanceCount -
        item.balancedSettlement -
        item.balancedPrepaid;
      if (newState === 'settle') {
        if (item.balancePrice <= 0) ctx.throw(400, '结算金额必须大于0', body);
      }
      if (newState === 'financialManager' || newState === 'finish') {
        if (item.preSettlement + item.prePrepaid <= 0) ctx.throw(400, '结算总额必须大于0', body);
        if (item.preSettlement + item.prePrepaid > balanceTotal) ctx.throw(400, '总结算金额不能大于待结算金额', body);
      }
      preSettlementCount += item.preSettlement;
      prePrepaidCount += item.prePrepaid;
    });
    if (newState === 'financialManager' || newState === 'finish') {
      if (body.arrears !== true) {
        if (account.value < preSettlementCount) ctx.throw(400, '账户结算款余额不足', body);
        if (account.prepaid < prePrepaidCount) ctx.throw(400, '账户预付款余额不足', body);
      }
    }
    for (let i = 0; i < businessTrains.length; i++) {
      const item = businessTrains[i];
      let update = {
        settleState: newState,
        stateCheckFail: ""
      };
      if (newState === 'settle') {
        update.balancePrice = Number(item.balancePrice);
      }
      if (newState === 'financialManager') {
        update.preSettlement = Number(item.preSettlement);
        update.prePrepaid = Number(item.prePrepaid);
      }
      if (newState === 'finish') {
        update.balancedSettlement = Number(item.preSettlement) + Number(item.balancedSettlement);
        update.balancedPrepaid = Number(item.prePrepaid) + Number(item.balancedPrepaid)
        if ((update.balancedSettlement + update.balancedPrepaid) !== item.balancePrice * item.balanceCount) {
          update.settleState = 'settle';
          update.preSettlement = 0;
          update.prePrepaid = 0;
        }
        await account.update({
          $inc: {
            value: -(item.preSettlement * item.balanceCount),
            prepaid: -(item.prePrepaid * item.balanceCount),
          }
        });
      }
      await ctx.model.BusinessTrains.update({
        _id: {
          $in: item._id
        }
      }, update);
    }
    return 'ok';
  }

  async multiCheckFail() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    await this.multiUpdateCheck(body);
    if (!body.text) ctx.throw(422, '审核失败原因必填');
    let newState = body.newSettleState;
    let roleType = {
      financial: 'settle',
      settle: 'financialManager'
    }
    if (!roleType[newState]) ctx.throw(422, '非法的状态', body);
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: body.company,
      type: roleType[newState]
    });
    if (!hasRole) ctx.throw(400, '您无操作权限', body);
    let businessTrains = body.businessTrains;
    for (let i = 0; i < businessTrains.length; i++) {
      const item = businessTrains[i];
      let update = {
        settleState: newState,
        stateCheckFail: roleType[newState]
      };
      await ctx.model.BusinessTrains.update({
        _id: {
          $in: item._id
        }
      }, update);
      let curdLog = new ctx.model.CurdLog({
        type: 'businessTrainsCheckFail',
        user: ctx.user._id,
        company: body.company,
        businessTrains: item._id,
        remark: body.text
      });
      await curdLog.save();
    }
  }


}
module.exports = BusinessTrainsService;