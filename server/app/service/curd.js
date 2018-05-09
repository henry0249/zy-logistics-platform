const Service = require('egg').Service;

class CurdService extends Service {
  async index() {
    const {
      ctx
    } = this;
    let {
      method,
      params
    } = ctx;
    let acceptObj = {
      'GET': ['find', 'findOne', 'findById'],
      'POST': ['add', 'set', 'update', 'find', 'findOne', 'findById', 'delete'],
      'PUT': ['update'],
      'DELETE': ['delete']
    }
    let accept = acceptObj[method];
    let flag = false;

    accept.forEach((item) => {
      if (params.curdType === item) {
        flag = true;
      }
    })

    if (!ctx.service.curd[params.curdType]) {
      flag = false;
    }

    const modelName = params.model.substring(0, 1).toUpperCase() + params.model.substring(1);
    const model = ctx.model[modelName];
    if (!model) {
      flag = false;
    }
    if (!flag) {
      ctx.throw(404, '无效的请求路径', {
        method,
        params
      });
    }
    let curdParam = {};
    if (method === 'GET') {
      curdParam = ctx.query;
    } else {
      curdParam = ctx.request.body;
    }
    if (ctx.service[params.model] && ctx.service[params.model][params.curdType]) {
      await ctx.service[params.model][params.curdType];
    }
    let data = await this[params.curdType](model, curdParam);
    if (!curdParam.withoutLog && modelName !== 'CurdLog') {
      let ua = ctx.helper.ua();
      let logParms = {
        method,
        ...params,
        body: curdParam,
        ...ua
      };
      if (ctx.user) {
        logParms.user = ctx.user._id;
      }
      if (curdParam.logRemark) {
        logParms.remark = curdParam.logRemark
      }
      await this.log(ctx.model.CurdLog, logParms);
    }
    return data;
  }

  async set(model, param) {
    if (JSON.stringify(param) === '{}') {
      ctx.throw(400, '添加的数据不能为空', param);
    }
    let vd = param.vd || param
    delete param.vd
    if (JSON.stringify(param) === '{}') {
      ctx.throw(400, '添加的数据不能为空', param);
    }
    let hasData = await model.findOne(vd)
    if (hasData) {
      await hasData.update(param);
      return await model.findById(hasData._id);
    } else {
      param.createdAt = new Date();
      let modelDate = new model(param);
      await modelDate.save();
      return modelDate;
    }
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
    if (!param.find || JSON.stringify(param.find) === '{}') {
      ctx.throw(400, '查询条件不能为空', param);
    }
    if (!param.update || JSON.stringify(param.update) === '{}') {
      ctx.throw(400, '更新内容不能为空', param);
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
      select = param.select || {};
    delete param.populate;
    delete param.select;
    return await model[findType](param).populate(populate)
      .select(select);
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
    if (!param || JSON.stringify(param) === '{}') {
      ctx.throw(400, '删除条件不能为空', param);
    }
    await model.remove(option, {
      multi
    });
    return '删除成功';
  }
  async log(model, param) {
    await this.add(model, param)
  }
}
module.exports = CurdService;