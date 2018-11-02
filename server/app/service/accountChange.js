const Service = require('egg').Service;
const field = require('../field/AccountChange');

class CompanyService extends Service {
  async checkField(body, roleArr = ['settle', 'financialManager']) {
    const ctx = this.ctx;
    if (!body.handle) ctx.throw(422, '操作公司必填');
    if (roleArr.length > 0) {
      let hasRole = await ctx.model.Role.findOne({
        type: {
          $in: roleArr
        },
        user: ctx.user._id,
        company: body.handle
      });
      if (!hasRole) ctx.throw(400, '您无操作权限');
    }
    if (Number(body.value) <= 0) ctx.throw(422, '金额必须大于0');
    if (!field.payUserType.option[body.payUserType]) ctx.throw(422, '付款用户类型错误');
    if (!field.type.option[body.type]) ctx.throw(422, '流水类型错误');
    if (body.payUserType === 'user' && !body.user) ctx.throw(422, '付款人必填');
    if (body.payUserType === 'company' && !body.company) ctx.throw(422, '付款公司必填');
    if (body.payUserType === 'mobile' && !body.mobile) ctx.throw(422, '付款方手机号必填');
    if (!body.remittanceTime) ctx.throw(422, '转账时间必填');
    if (!body.accountingTime) ctx.throw(422, '到账时间必填');
    if (body.payUserType === 'user') {
      let hasUser = await ctx.model.User.findById(body.user);
      if (!hasUser) ctx.throw(404, '付款人不存在');
    }
    if (body.payUserType === 'company') {
      let hasCompany = await ctx.model.Company.findById(body.company);
      if (!hasCompany) ctx.throw(404, '付款公司不存在');
    }
  }
  async add() {
    return await this.set();
  }

  async set() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    await this.checkField(body);
    if (body._id) ctx.throw(422, '不能操作已存在流水账单');
    body.author = ctx.user._id;
    delete body.invoice;
    delete body.check;
    delete body.auditor;
    delete body.createdAt;
    delete body.updatedAt;
    if (body.payUserType === 'user' || body.payUserType === 'company') {
      let accountBody = {
        type: body.payUserType,
        company: body.toCompany
      };
      if (body.payUserType === 'user') {
        accountBody.relationUser = body.user;
      }
      if (body.payUserType === 'company') {
        accountBody.relationCompany = body.company;
      }
      let account = await ctx.service.account.set(accountBody);
      body.account = account._id;
    }
    let accountChange = new ctx.model.AccountChange(body);
    await accountChange.save();
    // await this.setBalanced(accountChange._id, 'businessTrains');
    // await this.setBalanced(accountChange._id, 'logistics');
    return accountChange;
  }
  async setBalanced(accountChange, type) {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let arr = body[type];
    if (!(arr instanceof Array && arr.length > 0)) return;
    let typeIdArr = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      await ctx.model[type].update({
        _id: item._id
      }, {
        balanced: item.balanceForAccount + item.balanceForAccountPrepaid,
        balanceForAccount: 0,
        balanceForAccountPrepaid: 0,
        $addToSet: {
          balancedArr: {
            accountChange: accountChange,
            balanceForAccount: item.balanceForAccount,
            balanceForAccountPrepaid: item.balanceForAccountPrepaid
          }
        }
      });
      typeIdArr.push(item._id);
    }
    await ctx.model.AccountChange.update({
      _id: accountChange
    }, {
      [type]: typeIdArr
    });
  }
  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单_id必填');
    let accountChangeId = body._id;
    let accountChange = await ctx.model.AccountChange.findById(accountChangeId);
    if (!accountChange) ctx.throw(404, '账单不存在');
    await this.checkField(body);
    await this.setBalanced(accountChangeId, 'businessTrains');
    await this.setBalanced(accountChangeId, 'logistics');
    body.author = ctx.user._id;
    delete body._id;
    delete body.check;
    delete body.invoice;
    delete body.auditor;
    delete body.handle;
    delete body.createdAt;
    delete body.updatedAt;
    body.editCheckFailText = "";
    await ctx.model.AccountChange.update({
      _id: accountChangeId
    }, body);
    return 'ok';
  }
  async payUserUpdate() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单_id必填');
    let accountChangeId = body._id;
    let accountChange = await ctx.model.AccountChange.findById(accountChangeId);
    if (!accountChange) ctx.throw(404, '账单不存在');
    await this.checkField(body);
    if (payUserType === 'user') {
      if (ctx.user !== body.user) {
        ctx.throw(400, '您无权限操作该流水');
      }
    }
    if (payUserType === 'company') {
      let hasRole = await ctx.model.Role.findOne({
        type: ['settle', 'financialManager'],
        user: ctx.user._id,
        company: body.handle
      });
      if (!hasRole) ctx.throw(400, '您无权限操作该流水');
    }
    await this.setBalanced(accountChangeId, 'businessTrains');
    await this.setBalanced(accountChangeId, 'logistics');
    delete body._id;
    delete body.check;
    delete body.invoice;
    delete body.auditor;
    delete body.handle;
    delete body.createdAt;
    delete body.updatedAt;
    body.editCheckFailText = "";
    await ctx.model.AccountChange.update({
      _id: accountChangeId
    }, body);
    return 'ok';
  }

  async check() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单_id必填');
    let accountChangeId = body._id;
    await this.checkField(body, ['financialManager']);
    let accountChange = ctx.model.AccountChange.findById(accountChangeId);
    if (!accountChange) ctx.throw(404, '账单不存在');
    if (accountChange.check) ctx.throw(422, '账单已经审核,请勿重复操作');
    body.author = ctx.user._id;
    body.auditor = ctx.user._id;
    body.check = true;
    delete body._id;
    delete body.invoice;
    delete body.handle;
    delete body.createdAt;
    delete body.updatedAt;
    await accountChange.update(body);
    if (accountChange.account) {
      let updateAccount = {
        $inc: {}
      };
      if (Number(accountChange.type) === 1) {
        updateAccount.$inc.value = accountChange.value;
      }
      if (Number(accountChange.type) === 4) {
        updateAccount.$inc.prepaid = accountChange.value;
      }
      await ctx.model.Account.update({
        _id: accountChange.account
      }, updateAccount);
    }
    return 'ok';
  }
}
module.exports = CompanyService;