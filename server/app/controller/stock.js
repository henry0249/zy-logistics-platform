'use strict';

const Controller = require('egg').Controller;

class StockController extends Controller {
  async simpleStatistics(){
    const ctx = this.ctx;
    ctx.body = await ctx.service.stock.simpleStatistics();
  }
}

module.exports = StockController;
