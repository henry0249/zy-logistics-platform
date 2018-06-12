const Service = require('egg').Service;
const areaField = require('../field/Area');

class CompanyService extends Service {
  // async add() {
  //   const ctx = this.ctx;
  //   let body = ctx.request.body;
  //   if (!body.name || !body.unit || !body.spec || !body.mfrs) {
  //     ctx.throw(422, '商品信息未完善', body);
  //   }
  //   let hasGoods = await ctx.model.Goods.findOne({
  //     name: body.name,
  //     mfrs: body.mfrs
  //   });
  //   if (hasGoods) {
  //     ctx.throw(405, '此生产厂商已经存在同名商品', body);
  //   }
  //   let goodsModel = new ctx.model.Goods(body);
  //   await goodsModel.save();
  //   if (body.price instanceof Array && body.price.length > 0) {

  //   } else {
  //     ctx.throw(422, '价格信息必填', body);
  //   }
  //   for (let i = 0; i < body.price.length; i++) {
  //     let priceItem = body.price[i];
  //   }
  // }
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
          goods: goodsItem._id
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