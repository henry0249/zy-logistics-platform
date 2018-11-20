const Service = require('egg').Service;
const field = require('../field/AccountChange');

class AccountChangeService extends Service {
  async checkField(body) {
    const ctx = this.ctx;
    if (!body.handle) ctx.throw(422, '操作公司必填');
    if (Number(body.value) <= 0) ctx.throw(422, '金额必须大于0');
    if (!field.relationType.option[body.relationType]) ctx.throw(422, '付款用户类型错误');
    if (!field.type.option[body.type]) ctx.throw(422, '流水类型错误');
    if (body.relationType === 'user' && !body.user) ctx.throw(422, '付款人必填');
    if (body.relationType === 'company' && !body.company) ctx.throw(422, '付款公司必填');
    if (body.relationType === 'mobile' && !body.mobile) ctx.throw(422, '付款方手机号必填');
    if (!body.remittanceTime) ctx.throw(422, '转账时间必填');
    if (!body.accountingTime) ctx.throw(422, '到账时间必填');
    if (body.relationType === 'user') {
      let hasUser = await ctx.model.User.findById(body.user);
      if (!hasUser) ctx.throw(404, '付款人不存在');
    }
    if (body.relationType === 'company') {
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
    delete body.isChildren;
    delete body.children;
    delete body.settleRelation;
    if (body.relationType === 'user' || body.relationType === 'company') {
      let accountBody = {
        type: body.relationType,
        company: body.toCompany,
        relationType: body.relationType
      };
      if (body.relationType === 'user') accountBody.relationUser = body.user;
      if (body.relationType === 'company') accountBody.relationCompany = body.company;
      let account = await ctx.service.account.set(accountBody);
      body.account = account._id;
    }
    let accountChange = new ctx.model.AccountChange(body);
    await accountChange.save();
    await this.setBalanced(accountChange._id, body.settleList);
    return accountChange;
  }
  async setBalanced(accountChange, arr) {
    const ctx = this.ctx;
    if (!(arr instanceof Array && arr.length > 0)) return;
    let reqArr = [];
    arr.forEach((item) => {
      reqArr.push({
        balancedSettlement: item.preSettlement,
        balancedPrepaid: item.prePrepaid,
        accountChange: accountChange
      });
    });
    let res = await ctx.service.settleRelation.mutilAdd(reqArr);
    await ctx.model.AccountChange.update({
      _id: accountChange
    }, {
      settleRelation: res
    });
  }
  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单_id必填');
    let accountChangeId = body._id;
    let accountChange = await ctx.model.AccountChange.findById(accountChangeId);
    if (!accountChange) ctx.throw(404, '账单不存在');
    if (accountChange.isChildren) ctx.throw(422, '此流水不能操作,仅做备份');
    let isFinancialManager = await ctx.model.Role.findOne({
      type: 'financialManager',
      user: ctx.user._id,
      company: accountChange.handle
    });
    await this.checkField(body);
    body.author = ctx.user._id;
    body.checkFail = '';
    delete body._id;
    delete body.check;
    delete body.auditor;
    delete body.handle;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.children;
    delete body.isChildren;
    delete body.settleRelation;
    if (isFinancialManager) {
      if (accountChange.check && accountChange.account) {
        let updateAccount = {
          $inc: {}
        };
        if (Number(accountChange.type) === 1) {
          updateAccount.$inc.value = body.value - accountChange.value;
        }
        if (Number(accountChange.type) === 4) {
          updateAccount.$inc.prepaid = body.value - accountChange.value;
        }
        await ctx.model.Account.update({
          _id: accountChange.account
        }, updateAccount);
      }
      await ctx.model.AccountChange.update({
        _id: accountChangeId
      }, body);
      await this.setBalanced(accountChangeId, body.settleList);
    } else {
      if (accountChange.check) {
        let childrenData = JSON.parse(JSON.stringify(accountChange));
        delete childrenData._id;
        delete childrenData.children;
        delete childrenData.isChildren;
        childrenData.isChildren = true;
        let childrenMolde = new ctx.model.AccountChange({
          ...childrenData,
          ...body
        });
        await childrenMolde.save();
        await ctx.model.AccountChange.update({
          _id: accountChangeId
        }, {
          check: false,
          children: childrenMolde._id
        });
        await this.setBalanced(childrenMolde._id, body.settleList);
      } else {
        await ctx.model.AccountChange.update({
          _id: accountChangeId
        }, body);
        await this.setBalanced(accountChangeId, body.settleList);
      }
    }
    return 'ok';
  }

  async check() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单_id必填');
    let accountChangeId = body._id;
    await this.checkField(body);
    let accountChange = await ctx.model.AccountChange.findById(accountChangeId);
    if (!accountChange) ctx.throw(404, '账单不存在');
    if (accountChange.check) ctx.throw(422, '账单已经审核,请勿重复操作');
    body.auditor = ctx.user._id;
    body.check = true;
    body.checkFail = '';
    delete body._id;
    delete body.handle;
    delete body.children;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.isChildren;
    delete body.children;
    delete body.settleRelation;
    if (accountChange.children) {
      body.$unset = {
        children: 1
      };
    }
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
      if (accountChange.children) {
        let updateAccount = {
          $inc: {}
        };
        if (Number(accountChange.type) === 1) {
          updateAccount.$inc.value = body.value - accountChange.value;
        }
        if (Number(accountChange.type) === 4) {
          updateAccount.$inc.prepaid = body.value - accountChange.value;
        }
      }
      await ctx.model.Account.update({
        _id: accountChange.account
      }, updateAccount);
    }
    await accountChange.update(body);
    await this.setBalanced(accountChangeId, body.settleList);
    return 'ok';
  }

  async checkFail() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单_id必填');
    if (!body.text) ctx.throw(422, '审核失败原因必填');
    let accountChangeId = body._id;
    let accountChange = await ctx.model.AccountChange.findById(accountChangeId);
    if (!accountChange) ctx.throw(404, '账单不存在');
    if (accountChange.check) ctx.throw(422, '账单已经审核,请勿重复操作');
    await accountChange.update({
      checkFail: 'financialManager'
    });
    let curdLog = new ctx.model.CurdLog({
      type: 'accountChangeCheckFail',
      user: ctx.user._id,
      accountChange: accountChangeId,
      remark: body.text
    });
    await curdLog.save();
    return 'ok';
  }

  async delete() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '账单信息获取失败');
    let accountChange = await ctx.model.AccountChange.findById(body._id).populate([{
      path: 'settleRelation',
      populate: [{
        path: 'businessTrains'
      }, {
        path: 'logistics'
      }]
    }]);
    if (!accountChange) ctx.throw(404, '账单不存在');
    if (accountChange.check) ctx.throw(404, '账单已经审核,不能删除');
    for (let i = 0; i < accountChange.settleRelation.length; i++) {
      const item = accountChange.settleRelation[i];
      let modelNmae = item.type === 'businessTrains' ? 'BusinessTrains' : 'Logistics'
      await ctx.model[modelNmae].update({
        _id: item._id,
      }, {
        $inc: {
          preSettlement: -item.balancedSettlement,
          prePrepaid: -item.balancedPrepaid,
        }
      });
    }
    await ctx.service.curd.delete(ctx.model.AccountChange, {
      _id: body._id
    });
    return 'ok';
  }
}
module.exports = AccountChangeService;