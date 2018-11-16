'use strict';

const Controller = require('egg').Controller;

class AccountChangeController extends Controller {
  async check() {
    this.ctx.body = await this.ctx.service.accountChange.check();
  }
  async checkFail(){
    this.ctx.body = await this.ctx.service.accountChange.checkFail();
  }
}
module.exports = AccountChangeController;