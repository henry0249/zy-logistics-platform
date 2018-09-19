'use strict';

const Controller = require('egg').Controller;

class StockController extends Controller {
  async simpleStatistics(){
    const ctx = this.ctx;
    ctx.body = await ctx.service.stock.simpleStatistics();
  }
  async multi(){
    const ctx = this.ctx;
    ctx.body = await ctx.service.stock.multi();
  }
}

module.exports = StockController;
