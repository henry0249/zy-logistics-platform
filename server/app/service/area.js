const Service = require('egg').Service;
const areaField = require('../field/Area');

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
      path: 'province'
    }, {
      path: 'city'
    }, {
      path: 'county'
    }, {
      path: 'township'
    }, {
      path: 'street'
    }];
    let res = [];
    if (body.limit === 0) {
      res = await ctx.model.Area.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      })
    } else {
      res = await ctx.model.Area.find({
        ...body
      }).populate(populate).sort({
        updatedAt: -1
      }).limit(limit).skip(skip);
    }
    return res;
  }
  async preAdd(data) {
    const ctx = this.ctx;
    let hasData = await ctx.model.Area.findOne({
      key: data.key,
      name: data.name
    });
    if (hasData) {
      return hasData._id;
    }
    let model = new ctx.model.Area(data);
    await model.save();
    return model._id;
  }

  async add(skipSet) {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let typeObj = {
      0: 'province',
      1: 'city',
      2: 'county',
      3: 'township'
    };
    if (body.type === undefined) {
      ctx.throw(422, '区域类型必填', body);
    }
    if (!typeObj[body.type]) {
      ctx.throw(422, '无此区域类型', body);
    }
    if (body.data instanceof Array && body.data.length > 0) {

    } else {
      ctx.throw(422, '未选择区域数据', body);
    }


    let area = {};
    for (let i = 0; i < body.data.length; i++) {
      let item = JSON.parse(JSON.stringify(body.data[i]));
      if (i > 0) {
        for (let j = 0; j < i; j++) {
          item[typeObj[j]] = {
            type: typeObj[j],
            key: body.data[j].code,
            name: body.data[j].name
          };
        }
      }
      if (i === body.data.length - 1) {
        area = item;
        area.key = item.code;
        area.type = typeObj[i];
      }
    }
    let newAreaOption = {
      type: area.type,
      key: area.code,
      name: area.name
    };
    let hasData = await ctx.model.Area.findOne(newAreaOption);
    if (skipSet && hasData) {
      return hasData._id;
    }
    if (hasData) {
      ctx.throw(405, '区域数据已经存在,请勿重复添加', body);
    }
    if (area.type === 'city') {
      newAreaOption.province = await this.preAdd(area.province);
    }
    if (area.type === 'county') {
      newAreaOption.province = await this.preAdd(area.province);
      newAreaOption.city = await this.preAdd({
        ...area.city,
        province: newAreaOption.province
      });
    }
    if (area.type === 'township') {
      newAreaOption.province = await this.preAdd(area.province);
      newAreaOption.city = await this.preAdd({
        ...area.city,
        province: newAreaOption.province
      });
      newAreaOption.county = await this.preAdd({
        ...area.county,
        province: newAreaOption.province,
        city: newAreaOption.city
      });
    }
    let areaModel = new ctx.model.Area(newAreaOption);
    await areaModel.save();
    return areaModel._id;
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