'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async companyBadge() {
    this.ctx.body = await this.ctx.service.order.companyBadge();
  }
  async pending() {
    this.ctx.body = await this.ctx.service.order.pending();
  }
  async transfer() {
    this.ctx.body = await this.ctx.service.order.transfer();
  }
  async check() {
    this.ctx.body = await this.ctx.service.order.check();
  }
  async checkFail() {
    this.ctx.body = await this.ctx.service.order.checkFail();
  }
  async getOrderById() {
    this.ctx.body = await this.ctx.service.order.getOrderById();
  }
  async updateInfo() {
    this.ctx.body = await this.ctx.service.order.updateInfo();
  }
  async updateBusinessTrains() {
    this.ctx.body = await this.ctx.service.order.updateBusinessTrains();
  }
  async updateTransportTrains() {
    this.ctx.body = await this.ctx.service.order.updateTransportTrains();
  }
  
}
module.exports = OrderController;