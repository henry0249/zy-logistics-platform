const Service = require('egg').Service;
const is = require('is_js');

class CurdService extends Service {
  checkMethod() {
    const ctx = this.ctx;
    let {
      method,
      params
    } = ctx;
    let acceptObj = {
      'GET': ['find', 'findOne', 'findById'],
      'POST': ['add', 'set', 'update', 'find', 'findOne', 'findById', 'delete', 'aggregate', 'chart', 'count', 'multi', 'check', 'checkFail'],
      'PUT': ['update'],
      'DELETE': ['delete']
    }
    let accept = acceptObj[method];
    if (!accept) {
      ctx.throw(422, '不支持此请求方法', {
        method,
        acceptObj
      });
    }
    let flag = false;
    accept.forEach((item) => {
      if (params.curdType === item) {
        flag = true;
      }
    })
    if (!flag) {
      ctx.throw(422, '不支持此操作方法', {
        method,
        params,
        accept
      });
    }
    if (!this[params.curdType]) {
      ctx.throw(422, '没有找到操作方法', {
        method,
        params,
        accept
      });
    }
    return true;
  }
  checkModel() {
    const ctx = this.ctx;
    let params = ctx.params;
    const modelName = params.model.substring(0, 1).toUpperCase() + params.model.substring(1);
    if (!ctx.model[modelName]) {
      ctx.throw(422, '没有找到数据实体', {
        params
      });
    }
    return modelName;
  }
  checkRequire(params, requireArr) {
    const ctx = this.ctx;
    let fieldName = ctx.params.model.substring(0, 1).toUpperCase() + ctx.params.model.substring(1);
    let fields;
    try {
      fields = require('../field/' + fieldName);
    } catch (error) {
      ctx.throw(422, '无效的数据实体', {
        model: fieldName
      });
    }
    //根据require判空
    for (const key in fields) {
      let require = false;
      if (requireArr) {
        require = ctx.helper.inArr(requireArr, key);
      } else {
        require = fields[key].require;
      }
      if (require) {
        if (!params[key] || is.empty(params[key])) {
          ctx.throw(422, `${fields[key] ? fields[key].name : key}必填`, {
            key
          });
        }
      }
    }
    return true;
  }

  hasService(funName) {
    const ctx = this.ctx;
    let params = ctx.params;
    if (ctx.service[params.model] && ctx.service[params.model][funName]) {
      return true;
    } else {
      return false;
    }
  }
  async index() {
    const ctx = this.ctx;
    let {
      method,
      params
    } = ctx;
    this.checkMethod();
    let modelName = this.checkModel(),
      model = ctx.model[modelName],
      curdParam = {};
    if (method === 'GET') {
      curdParam = ctx.query;
    } else {
      curdParam = ctx.request.body;
    }

    let diyService = ctx.service[params.model];

    if (this.hasService('require')) {
      await diyService['require']();
    } else {
      if (params.curdType === 'add' || params.curdType === 'set') {
        this.checkRequire(curdParam);
      } else {
        this.checkRequire(curdParam, []);
      }
    }
    let data = 'ok';
    if (this.hasService(params.curdType)) {
      data = await diyService[params.curdType]();
    } else {
      data = await this[params.curdType](model, curdParam);
    }

    if (!curdParam.withoutLog) {
      let ua = ctx.helper.ua();
      let logParms = {
        method,
        ...params,
        body: JSON.stringify(curdParam),
        ...ua
      };
      if (ctx.user) {
        logParms.user = ctx.user._id;
      }
      if (ctx.company) {
        logParms.company = ctx.company._id;
      }
      if (ctx.sys) {
        logParms.sys = ctx.tokenData.sys;
      }
      if (curdParam.logRemark) {
        logParms.remark = curdParam.logRemark;
      }
      await this.log(ctx.model.CurdLog, logParms);
    }
    return data;
  }

  async set(model, param) {
    let vd = param.vd || param;
    delete param.vd;
    let hasData = await model.findOne(vd);
    if (hasData) {
      this.ctx.throw(400, '已经存在相同的数据', param);
    }
    let modelDate = new model(param);
    await modelDate.save();
    return modelDate;
  }
  async add(model, param) {
    let list = param.list || []
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let modelDate = new model(list[i]);
        await modelDate.save();
      }
      return `成功添加${list.length}条数据`
    } else {
      let modelDate = new model(param);
      await modelDate.save();
      return modelDate;
    }
  }
  async update(model, param) {
    let multi = param.multi || false;
    delete param.multi;
    if (param.update._id) {
      ctx.throw(400, '更新内容不能包含_id', param);
    }
    await model.update(param.find, param.update, {
      multi
    });
    return '更新成功';
  }
  async find(model, param, findType = 'find') {
    let limit = isNaN(Number(param.limit)) ? 10 : Number(param.limit),
      skip = Number(param.skip) || 0,
      sort = param.sort || {
        createdAt: -1
      },
      populate = param.populate || [],
      select = param.select || {};
    delete param.sort;
    delete param.populate;
    delete param.select;
    delete param.limit;
    delete param.skip;
    let list = await model[findType](param)
      .populate(populate)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select(select);
    return list;
  }
  async findOne(model, param, findType = 'findOne') {
    let populate = param.populate || [],
      select = param.select || {},
      sort = param.sort || {
        createdAt: -1
      };
    delete param.populate;
    delete param.select;
    delete param.sort;
    return await model[findType](param)
      .populate(populate)
      .select(select)
      .sort(sort);
  }
  async findById(model, param) {
    if (!param._id) {
      ctx.throw(400, '根据id查询数据id必填', param);
    }
    return await this.findOne(model, param, 'findById')
  }
  async delete(model, param) {
    let multi = param.multi || false;
    delete param.multi;
    let ctx = this.ctx;

    function p() {
      return new Promise((res, rej) => {
        model.remove(param, function (err, docs) {
          if (err) ctx.throw(404, '删除失败');
          res();
        });
      });
    }
    await p();
    return 'ok';
  }

  //聚合 data:{$push: "$$ROOT"} 根数据
  async aggregate(model, param) {
    return await model.aggregate(param);
  }

  async chart(model, param) {
    return 'ok';
  }

  async multi(model, param) {
    return 'ok';
  }

  async count(model, param) {
    let limit = isNaN(Number(param.limit)) ? 10 : Number(param.limit),
      skip = Number(param.skip) || 0;
    delete param.sort;
    delete param.populate;
    delete param.select;
    delete param.limit;
    delete param.skip;
    return await model.count(param)
      .limit(limit)
      .skip(skip);
  }

  async log(model, param) {
    await this.add(model, param);
  }
}
module.exports = CurdService;

// $or　　　　或关系

// 　　$nor　　　 或关系取反

// 　　$gt　　　　大于

// 　　$gte　　　 大于等于

// 　　$lt　　　　 小于

// 　　$lte　　　  小于等于

// 　　$ne            不等于

// 　　$in             在多个值范围内

// 　　$nin           不在多个值范围内

// 　　$all            匹配数组中多个值

// 　　$regex　　正则，用于模糊查询

// 　　$size　　　匹配数组大小

// 　　$maxDistance　　范围查询，距离（基于LBS）

// 　　$mod　　   取模运算

// 　　$near　　　邻域查询，查询附近的位置（基于LBS）

// 　　$exists　　  字段是否存在

// 　　$elemMatch　　匹配内数组内的元素

// 　　$within　　范围查询（基于LBS）

// 　　$box　　　 范围查询，矩形范围（基于LBS）

// 　　$center       范围醒询，圆形范围（基于LBS）

// 　　$centerSphere　　范围查询，球形范围（基于LBS）

// 　　$slice　　　　查询字段集合中的元素（比如从第几个之后，第N到第M个元素）