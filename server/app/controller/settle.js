'use strict';

const Controller = require('egg').Controller;

class SettleController extends Controller {
  async getBusinessTrainsTab() {
    const ctx = this.ctx
    ctx.body = await ctx.service.settle.getBusinessTrainsTab();
  }
}

module.exports = SettleController;