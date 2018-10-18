'use strict';

const Controller = require('egg').Controller;

class LogisticsController extends Controller {
  async companyBadge() {
    this.ctx.body = await this.ctx.service.logistics.companyBadge();
  }
  async check() {
    this.ctx.body = await this.ctx.service.logistics.check();
  }
  async checkFail() {
    this.ctx.body = await this.ctx.service.logistics.checkFail();
  }
}
module.exports = LogisticsController;