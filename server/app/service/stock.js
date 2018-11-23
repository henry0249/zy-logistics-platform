const Service = require('egg').Service;
const stockField = require('../field/Stock');

class StockService extends Service {
  async getModelBody(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!stockField.type.option[req.type]) ctx.throw(422, '库存类型错误', req);
    if (!req.company) ctx.throw(422, '公司信息获取失败', req);
    let company = await ctx.model.Company.findById(req.company);
    if (!company) ctx.throw(422, '公司不存在', req);
    if (!req.goods) ctx.throw(422, '商品信息获取失败', req);
    let goods = await ctx.model.Goods.findById(req.goods);
    if (!goods) ctx.throw(422, '商品不存在', req);
    if (req.type === 'out' || req.type === 'decrease') {
      if (Number(req.num) > Number(goods.stock)) ctx.throw(422, '不能超出当前商品库存', req);
    } else {
      if (Number(req.num) < 0) ctx.throw(422, '修改数量不能小于0', req);
    }
    let modelBody = {
      type: req.type,
      num: Number(req.num),
      company: req.company,
      goods: req.goods
    };
    if (req.remark) modelBody.remark = req.remark;
    if (req.order) modelBody.order = req.order;
    if (req.businessTrains) modelBody.businessTrains = req.businessTrains;
    if (req.logistics) modelBody.logistics = req.logistics;
    if (stockField.toType.option[req.toType]) {
      modelBody.toType = req.toType;
      if (req.toType === 'user' && !req.toUser) ctx.throw(422, '去往用户获取失败', req);
      if (req.toType === 'user' && req.toUser) modelBody.toUser = req.toUser;
      if (req.toType === 'company' && !req.toCompany) ctx.throw(422, '去往公司获取失败', req);
      if (req.toType === 'company' && req.toCompany) modelBody.toCompany = req.toCompany;
    }
    return modelBody;
  }
  async multi() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!(body && body instanceof Array && body.length > 0)) {
      ctx.throw(422, '批量操作失败,未接收到操作数据', body);
    }
    for (let i = 0; i < body.length; i++) {
      const item = body[i];
      await this.set(item);
    }
    return 'ok';
  }
  async multiSet(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req && req instanceof Array && req.length > 0)) ctx.throw(422, '批量操作失败,未接收到操作数据', req);
    for (let i = 0; i < body.length; i++) {
      const item = body[i];
      await this.set(item);
    }
    return 'ok';
  }
  async set(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    let modelBody = await this.getModelBody(req);
    let hasStock = false;
    if (modelBody.type === 'out' && modelBody.order && modelBody.businessTrains) {
      hasStock = await ctx.model.Stock.findOne({
        type: 'out',
        order: modelBody.order,
        businessTrains: modelBody.businessTrains
      });
      if (hasStock) return hasStock;
    }
    if (!hasStock) {
      modelBody.no = await ctx.helper.no(modelBody.goods, modelBody.company, 2);
      let stockModel = new ctx.model.Stock(modelBody);
      await stockModel.save();
      return stockModel;
    }
  }
  async add(param) {
    return await this.set(param);
  }
  async update(param) {
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '库存单获取失败');
    let stock = await ctx.model.Stock.findById(req._id);
    if (!stock) ctx.throw(404, '库存单不存在');
    if (stock.check) ctx.throw(422, '库存单已经审核');
    let modelBody = this.getModelBody(req);
    modelBody.$unset = {
      checkFail: 1
    };
    await stock.update(modelBody);
  }
  async check(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '库存单获取失败');
    let stock = await ctx.model.Stock.findById(req._id).populate([{
      path: 'goods'
    }]);
    if (!stock) ctx.throw(404, '库存单不存在');
    if (stock.check) ctx.throw(404, '库存单已经审核,请勿重新审核');
    if (!stock.goods) ctx.throw(404, '商品不存在');
    let goods = stock.goods;
    let newStock = 0;
    if (stock.type === 'in' || stock.type === 'increase') {
      newStock = goods.stock + stock.num;
    }
    if (stock.type === 'out' || stock.type === 'decrease') {
      newStock = goods.stock - stock.num;
    }
    if (stock.type === 'check') newStock = stock.num;
    let goodsUpdate = {
      old: goods.stock,
      new: newStock,
      dv: newStock - goods.stock,
      stock: newStock
    }
    await ctx.model.Goods.update({
      _id: goods._id
    }, goodsUpdate);
    await stock.update({
      check: true,
      $unset: {
        checkFail: 1
      }
    });
    return 'ok';
  }
  async checkFail(param) {
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '库存单获取失败');
    if (!req.text) ctx.throw(422, '审核失败原因必填');
    let stock = await ctx.model.Stock.findById(req._id);
    if (!stock) ctx.throw(404, '库存单不存在');
    if (stock.check) ctx.throw(422, '库存单已经审核');
    await stock.update({
      check: false,
      checkFail: 'stockAdmin'
    });
    let curdLog = new ctx.model.CurdLog({
      type: 'stockCheckFail',
      user: ctx.user._id,
      company: stock.company,
      stock: stock._id,
      remark: req.text
    });
    await curdLog.save();
    return 'ok';
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
    if (!body.goods) {
      ctx.throw(422, '商品信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司不存在', body);
    }
    let goods = await ctx.model.Goods.findById(body.goods);
    if (!goods) {
      ctx.throw(422, '商品不存在', body);
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
        goods: goods._id,
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
    if (!body.goods) {
      ctx.throw(422, '商品信息必填', body);
    }
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(422, '公司不存在', body);
    }
    let goods = await ctx.model.Goods.findById(body.goods);
    if (!goods) {
      ctx.throw(422, '商品不存在', body);
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
      goods: goods._id,
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
      goods: goods._id,
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
      goods: goods._id,
      company: company._id,
      state: "finish"
    });
    stockOutData.forEach((item) => {
      res.out.num += item.num;
      res.out.createdAt = item.createdAt;
    });
    res.check.num = await ctx.model.Stock.count({
      type: 'check',
      goods: goods._id,
      company: company._id,
      state: "finish"
    });
    let lastStockCheck = await ctx.model.Stock.findOne({
      type: 'check',
      goods: goods._id,
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