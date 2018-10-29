const Service = require('egg').Service;

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
  async financial() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司信息未找到', body);
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: company._id,
      type: 'financial'
    });
    if (!hasRole) {
      ctx.throw(400, '您无操作权限', body);
    }
    let businessTrains = body.businessTrains || [];
    if (businessTrains.length === 0) {
      ctx.throw(422, '预审数量不能为0', body);
    }
    for (let i = 0; i < businessTrains.length; i++) {
      const item = businessTrains[i];
      await ctx.model.BusinessTrains.update({
        _id: {
          $in: item._id
        }
      }, {
        financial: true,
        balancePrice: Number(item.balancePrice)
      });
    }
    return 'ok';
  }
  async settle() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司信息未找到', body);
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: company._id,
      type: 'settle'
    });
    if (!hasRole) {
      ctx.throw(400, '您无操作权限', body);
    }
    let businessTrains = body.businessTrains || [];
    if (businessTrains.length === 0) {
      ctx.throw(422, '结算数量不能为0', body);
    }
    for (let i = 0; i < businessTrains.length; i++) {
      const item = businessTrains[i];
      if (item.balanceForAccount !== undefined && item.balanceForAccountPrepaid !== undefined) {
        await ctx.model.BusinessTrains.update({
          _id: {
            $in: item._id
          }
        }, {
          balanceForAccount: item.balanceForAccount,
          balanceForAccountPrepaid: item.balanceForAccountPrepaid,
        });
      }
    }
    return 'ok';
  }
}
module.exports = BusinessTrainsService;