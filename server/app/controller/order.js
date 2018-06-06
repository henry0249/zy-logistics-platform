'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async add() {
    this.ctx.body = await this.ctx.service.order.add();
  }
  async badge(){
    this.ctx.body = await this.ctx.service.order.badge();
  }
  async pending(){
    this.ctx.body = await this.ctx.service.order.pending();
  }
}
module.exports = OrderController;