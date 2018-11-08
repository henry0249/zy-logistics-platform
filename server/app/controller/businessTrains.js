'use strict';

const Controller = require('egg').Controller;

class BusinessTrainsController extends Controller {
  async multiUpdate() {
    this.ctx.body = await this.ctx.service.businessTrains.multiUpdate();
  }
  async multiCheckFail() {
    this.ctx.body = await this.ctx.service.businessTrains.multiCheckFail();
  }
  async getInvoiceSummary() {
    this.ctx.body = await this.ctx.service.businessTrains.getInvoiceSummary();
  }
  async getInvoiceList() {
    this.ctx.body = await this.ctx.service.businessTrains.getInvoiceList();
  }
}
module.exports = BusinessTrainsController;