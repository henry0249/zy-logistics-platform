'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async companyBadge() {
    this.ctx.body = await this.ctx.service.order.companyBadge();
  }
  async transfer() {
    this.ctx.body = await this.ctx.service.order.transfer();
  }
  async pending() {
    this.ctx.body = await this.ctx.service.order.pending();
  }
  async getOrderById() {
    this.ctx.body = await this.ctx.service.order.getOrderById();
  }
  async dispatch() {
    this.ctx.body = await this.ctx.service.order.dispatch();
  }
  async mutilUpdate() {
    this.ctx.body = await this.ctx.service.order.mutilUpdate();
  }
  async check() {
    this.ctx.body = await this.ctx.service.order.check();
  }
  async checkFail() {
    this.ctx.body = await this.ctx.service.order.checkFail();
  }
}
module.exports = OrderController;