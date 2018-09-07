const Service = require('egg').Service;
const stockField = require('../field/Stock');

class StockService extends Service {
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司不存在', body);
    }
    if (!stockField.type.option[body.type]) {
      ctx.throw(422, '库存修改类型不存在', body);
    }
    if (boyd.type === 'out' || boyd.type === 'decrease') {
      if (Number(body.num) > Number(company.stock)) {
        ctx.throw(422, '不能超出当前公司库存', body);
      }
    } else {
      if (Number(body.num) < 0) {
        ctx.throw(422, '修改数量不能小于0', body);
      }
    }
    let newStock = 0;
    if (body.type === 'in' || body.type === 'increase') {
      newStock = Number(company.stock) + Number(body.num);
    }
    if (body.type === 'out' || body.type === 'decrease') {
      newStock = Number(company.stock) + Number(body.num);
    }
    if (body.type === 'check') {
      newStock = Number(body.num);
    }
    let stockModel = new ctx.model.Stock({
      ...body,
      old: company.stock,
      new: newStock,
      dv: newStock - Number(company.stock)
    });
    await stockModel.save();
    await company.update({
      stock: newStock
    });
    return 'ok';
  }
  async set() {
    return await this.add();
  }
}
module.exports = StockService;