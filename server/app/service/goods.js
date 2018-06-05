const Service = require('egg').Service;
const areaField = require('../field/Area');

class CompanyService extends Service {
  async cascader() {
    const ctx = this.ctx;
    let brands = await ctx.model.Brand.find();
    let res = [];
    for (let i = 0; i < brands.length; i++) {
      let brandItem = brands[i];
      let resItem = {
        label: brandItem.name,
        value: brandItem._id
      }
      let goods = await ctx.model.Goods.find({
        brand: brandItem._id
      });
      let brandChildren = [];
      for (let j = 0; j < goods.length; j++) {
        let goodsItem = goods[j];
        let brandChildrenItem = JSON.parse(JSON.stringify(goodsItem));
        brandChildrenItem.label = goodsItem.name;
        brandChildrenItem.value = goodsItem._id;
        let prices = await ctx.model.Price.find({
          goods:goodsItem._id
        });
        brandChildrenItem.price = prices;
        brandChildren.push(brandChildrenItem);
      }
      resItem.children = brandChildren;
      res.push(resItem);
    }
    return res;
  }
}
module.exports = CompanyService;