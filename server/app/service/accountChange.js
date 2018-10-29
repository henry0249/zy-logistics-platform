const Service = require('egg').Service;
const field = require('../field/AccountChange');

class CompanyService extends Service {

  async add() {
    return await this.set();
  }
  async set() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (body._id) ctx.throw(422, '不能操作已存在流水账单');
    if (Number(body.value) <= 0) ctx.throw(422, '金额必须大于0');
    if (!field.payUserType.option[body.payUserType]) ctx.throw(422, '付款用户类型错误');
    if (!field.type.option[body.type]) ctx.throw(422, '流水类型错误');
    if (body.payUserType === 'user' && !body.user) ctx.throw(422, '付款人必填');
    if (body.payUserType === 'company' && !body.company) ctx.throw(422, '付款公司必填');
    if (body.payUserType === 'mobile' && !body.mobile) ctx.throw(422, '付款方手机号必填');
    if (!body.remittanceTime) ctx.throw(422, '转账时间必填');
    if (!body.accountingTime) ctx.throw(422, '到账时间必填');
    // if (!(body.handle || body.author)) ctx.throw(422, '操作信息未完善');
    body.author = ctx.user._id;
    let accountChange = new ctx.model.AccountChange(body);
    await accountChange.save();
    await this.setBalanced(accountChange._id, 'businessTrains');
    await this.setBalanced(accountChange._id, 'logistics');
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
}
module.exports = CompanyService;