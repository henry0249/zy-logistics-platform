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
    if (body.type === 'out' || body.type === 'decrease') {
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
      newStock = Number(company.stock) - Number(body.num);
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
  async chart() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.type) {
      ctx.throw(422, '统计类型必填', body);
    }
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司不存在', body);
    }
    let type = body.type || 'week';
    let typeObj = {
      day: 1,
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };
    let today = Number(new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`).getTime());
    let nextDay = today + 24 * 60 * 60 * 1000 - 1;
    let xData = [];
    if (type === 'day') {
      for (let i = 0; i < 24; i++) {
        xData.push(new Date(today + i * 60 * 60 * 1000));
      }
    } else {
      for (let i = 0; i < typeObj[type]; i++) {
        xData.unshift(new Date(nextDay - i * 24 * 60 * 60 * 1000));
      }
    }
    let yData = { in: [],
      out: [],
      increase: [],
      decrease: [],
      check: [],
      stock: []
    };
    for (let i = 0; i < xData.length; i++) {
      let minDate = new Date(xData[i].getTime()) - 24 * 60 * 60 * 1000 - 1;
      let maxDate = new Date(Number(new Date(xData[i]).getTime()));
      if (type === 'day') {
        minDate = new Date(xData[i].getTime()) - 1 * 60 * 60 * 1000 - 1;
        xData[i] = new Date(xData[i]).getHours() + '点';
      }
      if (type === 'week') {
        let weekArr = ['日', '一', '二', '三', '四', '五', '六'];
        xData[i] = '周' + weekArr[new Date(xData[i]).getDay()];
      }
      if (type === 'month' || type === 'quarter' || type === 'year') {
        xData[i] = `${new Date(xData[i]).getFullYear()}-${new Date(xData[i]).getMonth()+1}-${new Date(xData[i]).getDate()}`;
      }
      let stocks = await ctx.model.Stock.find({
        company: company._id,
        createdAt: {
          $gte: minDate,
          $lte: maxDate
        }
      });
      let typeCount = { in: 0,
        out: 0,
        increase: 0,
        decrease: 0,
        check: 0,
        stock: 0
      };
      stocks.forEach(item => {
        if (typeCount[item.type] !== undefined) {
          typeCount[item.type] += Number(item.num);
        }
        typeCount.stock = Number(item.new);
      });
      for (const key in typeCount) {
        yData[key].push(typeCount[key]);
      }
    }
    return {
      xData,
      yData
    };
  }
}
module.exports = StockService;