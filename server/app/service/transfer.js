const Service = require('egg').Service;

class TransferService extends Service {
  async set() {
    return await this.add();
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.name) {
      ctx.throw(422, '中转点名称必填', body);
    }
    let area = await ctx.service.area.add(true);
    let transferModel = new ctx.model.Transfer({
      name: body.name,
      area: area
    });
    await transferModel.save();
    return transferModel._id;
  }
  data2idarr(data) {
    let res = [];
    data.forEach(item => {
      res.push(item._id);
    });
    return res;
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
            let transfers = await ctx.model.Transfer.find({
              area: {
                $in: this.data2idarr(townships)
              }
            });
            if (transfers.length > 0) {
              countyItem.children = transfers;
            }
          }
          if (countyItem.children && countyItem.children.length>0) {
            county.push(countyItem);
          }
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
module.exports = TransferService;