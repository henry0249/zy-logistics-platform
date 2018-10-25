'use strict';

const Controller = require('egg').Controller;

class BusinessTrainsController extends Controller {
  async financial() {
    this.ctx.body = await this.ctx.service.businessTrains.financial();
  }
  async settle(){
    this.ctx.body = await this.ctx.service.businessTrains.settle();
  }
}
module.exports = BusinessTrainsController;