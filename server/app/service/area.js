const Service = require('egg').Service;
const areaField = require('../field/Area');

class CompanyService extends Service {

  async preAdd0(data) {
    const ctx = this.ctx;
    let hasData = await ctx.model.Area.findOne(data);
    if (hasData) {
      return hasData._id;
    }
    let model = new ctx.model.Area(data);
    await model.save();
    return model._id;
  }
  async preAdd(data, option) {
    const ctx = this.ctx;
    let hasData = await ctx.model.Area.findOne(data);
    if (hasData) {
      return hasData._id;
    }
    let append = {};

    if (data.type === 'city') {
      append.province = await this.preAdd0(option.province);
    }
    if (data.type === 'county') {
      append.province = await this.preAdd0(option.province);
      append.city = await this.preAdd0(option.city);
    }
    if (data.type === 'township') {
      append.province = await this.preAdd0(option.province);
      append.city = await this.preAdd0(option.city);
      append.county = await this.preAdd0(option.county);
    }
    if (data.type === 'street') {
      append.province = await this.preAdd0(option.province);
      append.city = await this.preAdd0(option.city);
      append.county = await this.preAdd0(option.county);
      append.township = await this.preAdd0(option.township);
    }

    let model = new ctx.model.Area({
      ...data,
      ...append
    });
    await model.save();
    return model._id;
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
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
    let newAreaOption = {
      type: body.type,
      key: body[body.type].key,
      name: body[body.type].name
    };
    delete body.last;
    delete body[body.type];
    delete body.type;
    for (const key in body) {
      newAreaOption[key] = await this.preAdd({
        key: body[key].key,
        name: body[key].name,
        type: key
      }, body);
    }
    let areaModel = new ctx.model.Area(newAreaOption);
    await areaModel.save();
    return 'ok';
  }

  async cascader() {
    const ctx = this.ctx;
    let area = [];
    let provinces = await ctx.model.Area.find({
      type: 'province'
    });
    for (let i = 0; i < provinces.length; i++) {
      let provinceItem = JSON.parse(JSON.stringify(provinces[i]));
      let city = [];
      let citys = await ctx.model.Area.find({
        type: 'city',
        province: provinceItem._id
      });
      for (let j = 0; j < citys.length; j++) {
        let cityItem = JSON.parse(JSON.stringify(citys[j]));
        let county = [];
        let countys = await ctx.model.Area.find({
          type: 'county',
          city: cityItem._id
        });
        for (let k = 0; k < countys.length; k++) {
          let countyItem = JSON.parse(JSON.stringify(countys[k]));
          let townships = await ctx.model.Area.find({
            type: 'township',
            county: countyItem._id
          });
          if (townships.length > 0) {
            countyItem.children = townships;
          }
          county.push(countyItem);
        }
        if (county.length > 0) {
          cityItem.children = county;
          city.push(cityItem);
        }
      }
      if (city.length > 0) {
        provinceItem.children = city;
      }
      area.push(provinceItem);
    }
    return area;
  }
}
module.exports = CompanyService;