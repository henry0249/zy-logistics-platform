'use strict';

const Controller = require('egg').Controller;

class AccountChangeController extends Controller {
  async check() {
    this.ctx.body = await this.ctx.service.accountChange.check();
  }
  async payUserUpdateApply() {
    this.ctx.body = await this.ctx.service.accountChange.payUserUpdateApply();
  }
}
module.exports = AccountChangeController;