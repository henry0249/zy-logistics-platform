'use strict';

const Controller = require('egg').Controller;

class CompanyController extends Controller {
  async userCascader() {
    this.ctx.body = await this.ctx.service.company.userCascader();
  }
  async truckAndShipCascader() {
    this.ctx.body = await this.ctx.service.company.truckAndShipCascader();
  }
}
module.exports = CompanyController;