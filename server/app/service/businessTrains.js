const Service = require('egg').Service;
const businessTrainsField = require('../field/BusinessTrains');

class BusinessTrainsService extends Service {
  async delete() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    if (!body._id) {
      ctx.throw(422, '删除参数不完整', body);
    }
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
  async getInvoiceList() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.account) ctx.throw(422, '账户信息必填');
    if (!body.company) ctx.throw(422, '公司信息必填');
    let account = await ctx.model.Account.findOne({
      _id: body.account,
      company: body.company
    });
    if (!account) ctx.throw(404, '账户信息未找到');
    let data = await ctx.model.BusinessTrains.find({
      account: body.account
    }).populate([{
      path: 'order'
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }]
    }]);
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let invoicedLess = item.balancePrice * item.balanceCount -
        balancedSettlement -
        balancedPrepaid -
        item.invoiced;
      if (invoicedLess > 0) {
        res.push(item);
      }
    }
    return res;
  }
}
module.exports = BusinessTrainsService;