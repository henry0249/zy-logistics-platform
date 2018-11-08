'use strict';

const Controller = require('egg').Controller;

class InvoiceController extends Controller {
  async check() {
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.check();
  }
  async checkFail() {
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.checkFail();
  }

  async getInvoiceTab() {
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.getInvoiceTab();
  }
  
  async getInvoiceList(){
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.getInvoiceList();
  }
}

module.exports = InvoiceController;