const Service = require('egg').Service;

class CompanyService extends Service {
  async preAdd(data, option) {
    const ctx = this.ctx;
    let hasData = await ctx.model.Area.findOne(data);
    if (hasData) {
      return hasData;
    }
    if (data.type === 'city') {
      data.province = option.province;
    }
    if (data.type === 'county') {
      data.province = option.province;
      data.city = option.city;
    }
    if (data.type === 'township') {
      data.province = option.province;
      data.city = option.city;
      data.county = option.county;
    }
    if (data.type === 'street') {
      data.province = option.province;
      data.city = option.city;
      data.county = option.county;
      data.township = option.township;
    }
    let model = new ctx.model.Area(data);
    await model.save();
    return model;
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    console.log(body);
    if (!body[body.type]) {
      ctx.throw(422, '信息填写不完整', body);
    }
    let area = {};

    let hasData = await ctx.model.Area.findOne({
      type: body.type,
      key: body[body.type].key
    });
    if (hasData) {
      ctx.throw(405, '区域数据已经存在,请勿重复添加', body);
    }
    let modelOption = {
      type: body.type,
      key: body[body.type].key,
      name: body[body.type].name
    };
    if (body.type === 'city') {
      if (body.province) {
        modelOption.province = body.province.key;
      } else {
        modelOption.province = body[body.type].key;
      }
    }
    if (body.type === 'county') {
      if (body.province) {
        modelOption.province = body.province.key;
      } else {
        modelOption.province = body[body.type].key;
      }
      if (body.city) {
        modelOption.city = body.city.key;
      } else {
        modelOption.city = body[body.type].key;
      }
    }
    if (body.type === 'township') {
      if (body.province) {
        modelOption.province = body.province.key;
      } else {
        modelOption.province = body[body.type].key;
      }
      if (body.city) {
        modelOption.city = body.city.key;
      } else {
        modelOption.city = body[body.type].key;
      }
      if (body.county) {
        modelOption.county = body.county.key;
      } else {
        modelOption.county = body[body.type].key;
      }
    }
    if (body.type === 'street') {
      if (body.province) {
        modelOption.province = body.province.key;
      } else {
        modelOption.province = body[body.type].key;
      }
      if (body.city) {
        modelOption.city = body.city.key;
      } else {
        modelOption.city = body[body.type].key;
      }
      if (body.county) {
        modelOption.county = body.county.key;
      } else {
        modelOption.county = body[body.type].key;
      }
      if (body.township) {
        modelOption.township = body.township.key;
      } else {
        modelOption.township = body[body.type].key;
      }
    }
    let model = new ctx.model.Area(modelOption);
    await model.save();
    delete body.type;
    delete body[body.type];
    for (const key in body) {
      await this.preAdd({
        type: key,
        key: body[key].key,
        name: body[key].name
      }, modelOption);
    }
    return '添加成功';
  }
}
module.exports = CompanyService;