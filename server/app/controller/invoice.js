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

  async getWaitInvoiceTab() {
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.getWaitInvoiceTab();
  }
  
  async getWaitInvoiceList(){
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.getWaitInvoiceList();
  }

  async waitSummary(){
    const ctx = this.ctx
    ctx.body = await ctx.service.invoice.waitSummary();
  }
  
}

module.exports = InvoiceController;