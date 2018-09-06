'use strict';

const Controller = require('egg').Controller;

class LogisticsController extends Controller {
  async companyBadge(){
    this.ctx.body = await this.ctx.service.logistics.companyBadge();
  }
}
module.exports = LogisticsController;