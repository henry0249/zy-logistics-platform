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
    };
    findBody[type] = {
      $in: body[type]
    };
    // let arr = body[type]; //用数组判断不行.疑惑
    // arr.indexOf(body._id.toString());
    let mySet = new Set(body[type]);
    if (mySet.has(body._id.toString())) {
      ctx.throw(422, "自己无法作为关联公司", body);
    }
    let sameRelationCompany = await ctx.model.Company.findOne(findBody);
    if (sameRelationCompany) {
      return;
    }
    if (!body.relationCode) {
      ctx.throw(422, "关联新公司时,关联代码必填", body);
    }
    let relationCode = await ctx.model.RelationCode.findOne({
      value: body.relationCode
    });
    let relationCodeTypeRelation = {
      business: 'businessRelationCompany',
      transport: 'transportTrainsRelationCompany',
      account: 'accountRelationCompany'
    };
    if (relationCode.type !== undefined && relationCode.type !== 'common') {
      if (relationCodeTypeRelation[relationCode.type] !== type) {
        ctx.throw(422, "关联代码不适用于此次关联类型", body);
      }
    }
    if (!relationCode) {
      ctx.throw(422, "无效的关联代码", body);
    }
    if (new Date().getTime() - (new Date(relationCode.createdAt).getTime()) >= Number(relationCode.expiration)) {
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
  async receivablesTab() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    if (!body.role) {
      ctx.throw(422, '权限信息获取失败', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(404, '公司信息未找到', body);
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: company._id,
      type: body.role
    });
    if (!hasRole) {
      // ctx.throw(400, '您无操作权限', body);
      return [];
    }
    let businessTrainsData = await ctx.model.BusinessTrains.find({
      receivedCompany: company._id
    });
    let payIdArr = [];
    businessTrainsData.forEach((item) => {
      let addType = 'company';
      if (item.type === 'customer') {
        addType = item.customerType;
      }
      let pushItem = {
        type: addType,
        _id: item[addType].toString()
      };
      payIdArr.push(pushItem);
    });
    payIdArr = ctx.helper.unique(payIdArr, '_id');
    let res = [];
    for (let i = 0; i < payIdArr.length; i++) {
      let payItem = payIdArr[i];
      let payData;
      if (payItem.type === 'company') {
        payData = await ctx.model.Company.findById(payItem._id);
      }
      if (payItem.type === 'user') {
        payData = await ctx.model.User.findById(payItem._id);
      }
      let pushItem = JSON.parse(JSON.stringify(payData));
      if (payItem.type === 'user') {
        pushItem.isUser = true;
      }
      res.push(pushItem);
    }
    return res;
  }
  async receivables() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    if (!body.role) {
      ctx.throw(422, '权限信息获取失败', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(404, '公司信息未找到', body);
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: company._id,
      type: body.role
    });
    if (!hasRole) {
      return [];
    }
    let findBody = {
      receivedCompany: company._id,
      financial: body.financial || false,
      user: "",
      company: ""
    };
    if (body.payCompany) {
      findBody.company = body.payCompany;
      delete findBody.user;
      if (!findBody.company) {
        ctx.throw(422, '参数错误', body);
      }
    }
    if (body.payUser) {
      findBody.user = body.payUser;
      delete findBody.company;
      if (!findBody.user) {
        ctx.throw(422, '参数错误', body);
      }
    }
    let modelNameObj = {
      'businessTrains': 'BusinessTrains',
      'logistics': 'Logistics'
    };
    let modelName = modelNameObj.businessTrains;
    if (body.type === 'businessTrains' || body.type === 'logistics') {
      modelName = modelNameObj[body.type];
    }
    let data = await ctx.model[modelName].find(findBody).populate([{
      path: 'order'
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }]
    }]);
    let res = [];
    data.forEach((item) => {
      if (item.balancePrice * item.balanceCount - item.balanced > 0) {
        res.push(item);
      }
    });
    return res;
  }
}
module.exports = CompanyService;