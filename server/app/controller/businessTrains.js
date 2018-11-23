'use strict';

const Controller = require('egg').Controller;

class BusinessTrainsController extends Controller {
  async mutilUpdateBalancePrice() {
    this.ctx.body = await this.ctx.service.businessTrains.mutilUpdateBalancePrice();
  }
}
module.exports = BusinessTrainsController;