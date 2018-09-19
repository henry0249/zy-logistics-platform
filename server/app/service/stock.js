const Service = require('egg').Service;
const stockField = require('../field/Stock');

class StockService extends Service {
  async multi(){
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!(body && body instanceof Array && body.length>0)) {
      ctx.throw(422, '批量操作失败,未接收到操作数据', body);
    }
    for (let i = 0; i < body.length; i++) {
      const item = body[i];
      await this.add(item);
    }
    return 'ok';
  }
  async add(data) {
    const ctx = this.ctx;
    let body = ctx.request.body || data;
    if (!body.goods) {
      ctx.throw(422, '商品信息必填', body);
    }
    let goods = await ctx.model.Goods.findById(body.goods);
    if (!goods) {
      ctx.throw(422, '商品不存在', body);
    }
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
      if (Number(body.num) > Number(goods.stock)) {
        ctx.throw(422, '不能超出当前商品库存', body);
      }
    } else {
      if (Number(body.num) < 0) {
        ctx.throw(422, '修改数量不能小于0', body);
      }
    }
    let newStock = 0;
    if (body.state === 'finish') {
      if (body.type === 'in' || body.type === 'increase') {
        newStock = Number(goods.stock) + Number(body.num);
      }
      if (body.type === 'out' || body.type === 'decrease') {
        newStock = Number(goods.stock) - Number(body.num);
      }
      if (body.type === 'check') {
        newStock = Number(body.num);
      }
    } else {
      newStock = Number(goods.stock);
    }
    let stockModel = new ctx.model.Stock({
      ...body,
      old: company.stock,
      new: newStock,
      dv: newStock - Number(goods.stock),
    });
    await stockModel.save();
    await goods.update({
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
        $or: [{
          state: 'finish'
        }, {
          state: {
            $exists: false
          }
        }],
        company: company._id,
        createdAt: {
          // $gte: minDate,
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

  async simpleStatistics() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) {
      ctx.throw(422, '公司信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司不存在', body);
    }
    let res = {
      stock: {
        num: 0
      },
      in: {
        num: 0
      },
      out: {
        num: 0
      },
      check: {
        num: 0
      }
    };
    let lastStock = await ctx.model.Stock.findOne({
      company: company._id,
      state: "finish"
    }).sort({
      createdAt: -1
    });
    res.stock = {
      num: lastStock.new,
      createdAt: lastStock.createdAt
    };
    //累计入库
    let stockInData = await ctx.model.Stock.find({
      type: 'in',
      company: company._id,
      state: "finish"
    });
    stockInData.forEach((item) => {
      res.in.num += item.num;
      res.in.createdAt = item.createdAt;
    });
    //累计出库
    let stockOutData = await ctx.model.Stock.find({
      type: 'out',
      company: company._id,
      state: "finish"
    });
    stockOutData.forEach((item) => {
      res.out.num += item.num;
      res.out.createdAt = item.createdAt;
    });
    res.check.num = await ctx.model.Stock.count({
      type: 'check',
      company: company._id,
      state: "finish"
    });
    let lastStockCheck = await ctx.model.Stock.findOne({
      type: 'check',
      company: company._id,
      state: "finish",
    }).sort({
      createdAt: -1
    });
    if (lastStockCheck) {
      res.check.createdAt = lastStockCheck.createdAt;
    }
    return res;
  }
}
module.exports = StockService;