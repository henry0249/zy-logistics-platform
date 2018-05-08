const Service = require('egg').Service;

class CurdService extends Service {
  async index() {
    const ctx = this.ctx
    let {
      method,
      params
    } = ctx;
    let acceptObj = {
      'GET': ['find', 'findOne'],
      'POST': ['set', 'find', 'findOne', 'update', 'delete'],
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

    const model = this.ctx.model[modelName];

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
    if (this.app.controller[params.model] && this.app.controller[params.model][params.curdType]) {
      await this.app.controller[params.model][params.curdType];
    }
    return await this[params.curdType](model, curdParam);
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
  async update(param) {

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
  async delete(param) {

  }
}
module.exports = CurdService;