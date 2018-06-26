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
  async getOrderById(){
    this.ctx.body = await this.ctx.service.order.getOrderById();
  }
  async dispatch(){
    this.ctx.body = await this.ctx.service.order.dispatch();
  }
}
module.exports = OrderController;