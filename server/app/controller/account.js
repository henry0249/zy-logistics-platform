'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async relationTab() {
    this.ctx.body = await this.ctx.service.account.relationTab();
  }
  async relationList() {
    this.ctx.body = await this.ctx.service.account.relationList();
  }
  async waitingForInvoice(){
    this.ctx.body = await this.ctx.service.account.waitingForInvoice();
  }
}
module.exports = AccountController;