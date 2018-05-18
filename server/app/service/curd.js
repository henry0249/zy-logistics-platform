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
      'POST': ['add', 'set', 'update', 'find', 'findOne', 'findById', 'delete'],
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
    return ctx.model[modelName];
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
          ctx.throw(422, `${fields[key] ? fields[key].name : key}不能为空`, {
            key
          });
        }
      }
    }
    return true;
  }
  checkFiled(fieldName, params = {}, curdType) {
    let checkParam = JSON.parse(JSON.stringify(params));
    delete checkParam._id;
    delete checkParam.sort;
    delete checkParam.populate;
    delete checkParam.select;
    delete checkParam.limit;
    delete checkParam.skip;
    delete checkParam.multi;
    delete checkParam.vd;

    if (curdType === 'update') {
      checkParam = JSON.parse(JSON.stringify(params.update));
    }

    const ctx = this.ctx;
    let fields;
    try {
      fields = require('../field/' + fieldName);
    } catch (error) {
      this.ctx.throw(422, '无效的数据实体', {
        model: fieldName
      });
    }
    // if (is.empty(checkParam)) {
    //   this.ctx.throw(422, '参数不能为空');
    // }

    const isCheckType = [
      'Object',
      'Number',
      'String',
      'Array',
      'Date',
      'Boolean',
    ];

    for (const key in checkParam) {
      if (!fields.hasOwnProperty(key)) {
        this.ctx.throw(422, '无效的字段', {
          key
        });
      }
      let field = fields[key],
        param = checkParam[key];
      if (!is.json(param)) {
        if (ctx.helper.inArr(isCheckType, field.type)) {
          if (!is[field.type.toLowerCase()](param)) {
            this.ctx.throw(422, `${field ? field.name : key}数据类型错误`, {
              [key]: param
            });
          }
        } else if (field.type === 'ObjectId') {
          if (!is.string(param) || param.length !== 24) {
            this.ctx.throw(422, `${field ? field.name : key}必须是_id格式`, {
              [key]: param
            });
          }
        } else if (field.type === 'ObjectIdArray') {
          if (is.array(param)) {
            let flag = true;
            param.forEach((item, index) => {
              if (!is.string(item) || item.length !== 24) {
                this.ctx.throw(422, `${field.name}必须是全部由_id元素组成,第${index+1}个元素不是_id格式`, {
                  [key]: param
                });
              }
            });
          } else {
            this.ctx.throw(422, `${field ? field.name : key}必须是数组形式`, {
              [key]: param
            });
          }
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
    let model = this.checkModel();
    let curdParam = {};
    if (method === 'GET') {
      curdParam = ctx.query;
    } else {
      curdParam = ctx.request.body;
    }
    let diyService = ctx.service[params.model];

    if (this.hasService('beforeCurd')) {
      let beforeRes = await diyService['beforeCurd'](params.curdType, curdParam);
      if (beforeRes) {
        curdParam = beforeRes;
      }
    }

    // if (params.curdType === 'add' || params.curdType === 'set') {
    //   this.checkRequire(curdParam);
    // } else {
    //   this.checkRequire(curdParam, []);
    // }
    // if (this.hasService('require')) {
    //   let diyRequireArr = await diyService['require'](params.curdType, curdParam);
    //   await this.checkRequire(modelName, curdParam, diyRequireArr);
    // } else {
    //   if (params.curdType === 'add' || params.curdType === 'set') {
    //     this.checkRequire(modelName, curdParam);
    //   } else {
    //     this.checkRequire(modelName, curdParam, []);
    //   }
    // }
    // this.checkFiled(modelName, curdParam, params.curdType);

    if (this.hasService(params.curdType)) {
      curdParam = await diyService[params.curdType](curdParam);
    }

    if (this.hasService('beforeExecuted')) {
      curdParam = await diyService['beforeExecuted'](params.curdType, curdParam);
    }

    let data = await this[params.curdType](model, curdParam);

    if (this.hasService('curdCallback')) {
      data = await diyService['curdCallback']({
        curdType: params.curdType,
        data,
        curdParam
      });
    }

    if (!curdParam.withoutLog) {
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
    let vd = param.vd || param;
    delete param.vd;
    let hasData = await model.findOne(vd);
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
    await model.remove(param, {
      multi
    });
    return '删除成功';
  }
  async log(model, param) {
    await this.add(model, param)
  }
}
module.exports = CurdService;