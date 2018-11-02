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
    if (!body.settleState) {
      ctx.throw(422, '订单结算状态获取失败', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(404, '公司信息未找到', body);
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: company._id,
      type: body.settleState
    });
    if (!hasRole) {
      // ctx.throw(400, '您无操作权限', body);
      return [];
    }
    return await ctx.model.Account.find({
      company: company._id,
      $or: [{
          relationCompany: {
            $exists: true
          }
        },
        {
          relationUser: {
            $exists: true
          }
        }
      ]
    }).populate([{
      path: 'relationUser'
    }, {
      path: 'relationCompany'
    }]);
  }
  async receivables() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company && !body.user) {
      ctx.throw(422, '付款信息获取失败', body);
    }
    if (!body.receivedCompany) {
      ctx.throw(422, '收款公司信息获取失败', body);
    }
    if (!body.settleState) {
      ctx.throw(422, '订单结算状态获取失败', body);
    }
    let receivedCompany = await ctx.model.Company.findById(body.receivedCompany);
    if (!receivedCompany) {
      ctx.throw(404, '收款公司信息未找到', body);
    }
    let hasRole = await ctx.model.Role.findOne({
      user: ctx.user._id,
      company: receivedCompany._id,
      type: body.settleState
    });
    if (!hasRole) {
      return [];
    }
    let findBody = {
      receivedCompany: receivedCompany._id,
      settleState: body.settleState || 'financial'
    };
    if (body.company) {
      findBody.company = body.company;
    }
    if (body.user) {
      findBody.user = body.company;
    }
    let settleType = body.settleType || 'businessTrains';
    if (!(settleType === 'businessTrains' || settleType === 'logistics')) ctx.throw(422, '结算模式错误', body);
    let modelNameObj = {
      'businessTrains': 'BusinessTrains',
      'logistics': 'Logistics'
    };
    let modelName = modelNameObj[settleType];
    let data = await ctx.model[modelName].find(findBody).populate([{
      path: 'order'
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }]
    }]);
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let item = JSON.parse(JSON.stringify(data[i]));
      let balanced = item.balancedSettlement + item.balancedPrepaid;
      let preBalanced = item.balancePrice * item.balanceCount;
      if (item.balancePrice === 0) {
        preBalanced = item.preBalancePrice * item.balanceCount;
      }
      if (preBalanced - balanced > 0) {
        if (item.order.state === 'financial') {
          if (item.stateCheckFail) {
            let findBody = {
              type: settleType + 'CheckFail',
              [settleType]: item._id
            }
            let checkFailLog = await ctx.model.CurdLog.findOne(findBody).sort({
              createdAt: -1
            });
            item.stateCheckFailLog = checkFailLog;
          }
          res.push(item);
        }
      }
    }
    return res;
  }
}
module.exports = CompanyService;