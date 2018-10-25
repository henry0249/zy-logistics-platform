'use strict';

const Controller = require('egg').Controller;

class CompanyController extends Controller {
  async userCascader() {
    this.ctx.body = await this.ctx.service.company.userCascader();
  }
  async receivablesTab() {
    this.ctx.body = await this.ctx.service.company.receivablesTab();
  }
  async receivables() {
    this.ctx.body = await this.ctx.service.company.receivables();
  }
}
module.exports = CompanyController;