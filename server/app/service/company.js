const Service = require('egg').Service;
const companyField = require('../field/Company');

class CompanyService extends Service {
  async checkRelationCode(body, type) {
    const ctx = this.ctx;
    if (!body[type]) {
      return;
    }
    if (body[type] && body[type].length === 0) {
      return;
    }
    let findBody = {
      _id: body._id
    }
    findBody[type] = body[type];
    let relationCheck = await ctx.model.Company.findOne(findBody);
    if (relationCheck) {
      return;
    }
    if (!body.relationCode) {
      ctx.throw(422, "关联新公司时,关联代码必填", body);
    }
    let relationCode = await ctx.model.RelationCode.findOne({
      value: body.relationCode
    });
    if (!relationCode) {
      ctx.throw(422, "无效的关联代码", body);
    }
    if ((new Date(relationCode.createdAt).getTime() + relationCode.expiration) > new Date().getTime()) {
      await ctx.service.curd.delete(ctx.model.RelationCode, {
        _id: relationCode._id
      });
      ctx.throw(422, "关联代码已过期", body);
    }

    await relationCode.update({
      $addToSet: {
        relation: body[type]
      }
    });
  }
  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (body.find && body.update) {
      body = {
        ...body.find,
        ...body.update
      }
    }
    if (!body._id) {
      ctx.throw(422, "公司信息未找到", body);
    }
    let company = await ctx.model.Company.findById(body._id);
    if (!company) {
      ctx.throw(404, "公司信息未找到", body);
    }
    await this.checkRelationCode(body, 'businessRelationCompany');
    await this.checkRelationCode(body, 'transportTrainsRelationCompany');
    await this.checkRelationCode(body, 'accountRelationCompany');
    delete body._id;
    delete body.updatedAt;
    delete body.createdAt;
    await company.update(body);
    return 'ok';
  }
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