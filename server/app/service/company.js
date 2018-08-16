const Service = require('egg').Service;
const companyField = require('../field/Company');

class CompanyService extends Service {
  async find() {
    const ctx = this.ctx;
    let body = ctx.request.body || ctx.request.query;
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    delete body.limit;
    delete body.skip;
    delete body.populate;
    let populate = [{
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
    }];
    let res = [];
    if (body.limit === 0) {
      res = await ctx.model.Company.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      })
    } else {
      res = await ctx.model.Company.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      }).limit(limit).skip(skip);
    }
    return res;
  }
  async userCascader() {
    const ctx = this.ctx;
    let body = {};
    if (ctx.method === 'GET') {
      body = ctx.request.query;
    } else {
      body = ctx.request.body;
    }
    if (!body.company) {
      ctx.throw(422, '公司_id必填', body);
    }
    let res = [];

    let user = {
      salesman: '业务专员',
      dispatchCheck: '调度审核员',
      dispatcher: '调度专员',
      finishCheck: '完成审核员',
      financial: '财务文员',
      documentClerk: '单据文员'
    }
    for (const key in user) {
      let item = {
        name: user[key],
        _id: key
      }
      let role = await ctx.model.Role.find({
        company: body.company,
        type: key
      }).populate([{
        path: 'user'
      }]);
      if (role.length > 0) {
        item.children = [];
        role.forEach(roleItem => {
          item.children.push(roleItem.user);
        });
        res.push(item);
      }
    }
    return res;
  }
}
module.exports = CompanyService;