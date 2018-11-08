const Service = require('egg').Service;

class InvoiceService extends Service {
  async setBusinessTrains(arr, updateType = 'preCheck') {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!(arr && arr instanceof Array && arr.length > 0)) return [];
    let invoiceSummary = await ctx.service.businessTrains.getInvoiceSummary();
    if (invoiceSummary.total === 0) ctx.throw(400, '可开票金额为0');
    if (invoiceSummary.total < Number(body.value)) ctx.throw(400, '可开票金额不足');
    let total = 0;
    for (let i = 0; i < businessTrains.length; i++) {
      const item = businessTrains[i];
      let update = {
        preCheck: {
          preInvoiced: item.preInvoiced,
        },
        checkFail: {
          preInvoiced: 0
        },
        check: {
          preInvoiced: 0,
          Invoiced: {
            $inc: item.preInvoiced
          }
        }
      }
      await ctx.model.BusinessTrains.update({
        _id: item._id
      }, update[updateType]);
      total += item.preInvoiced;
    }
  }
  async set() {
    return await this.add();
  }
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) ctx.throw(400, '开票公司获取失败');
    let isBusinessTrains = body.isBusinessTrains || true;
    let isLogistics = body.isLogistics || false;
    if (isBusinessTrains) {
      let businessTrains = body.businessTrains;
      if (!(businessTrains && businessTrains.length > 0)) ctx.throw(400, '开票列表不能为空');
      let invoiceSummary = await ctx.service.businessTrains.getInvoiceSummary();
      if (invoiceSummary.total === 0) ctx.throw(400, '可开票金额为0');
      if (Number(body.value) > invoiceSummary.total) ctx.throw(400, '可开票金额不足');
      let total = 0;
      for (let i = 0; i < businessTrains.length; i++) {
        const item = businessTrains[i];
        await ctx.model.BusinessTrains.update({
          _id: item._id
        }, {
          preInvoiced: item.preInvoiced,
        });
        total += item.preInvoiced;
      }
      let invoiceBody = {
        value: total,
        taxRate: body.taxRate,
        type: body.type,
        company: body.company,
        businessTrainsArr: businessTrains,
        check: false
      };
      if (invoiceBody.value === 0) ctx.throw(400, '开票金额不能为0');
      if (['user', 'company', 'mobile'].indexOf(invoiceBody.type) < 0) ctx.throw(400, '收票方类型错误');
      if (body.toType === 'user') invoiceBody.toUser = body.toUser;
      if (body.toType === 'company') invoiceBody.toCompany = body.toCompany;
      if (body.toType === 'mobile') invoiceBody.toMobile = body.toMobile;
      let invoiceModel = new ctx.model.Invoice(invoiceBody);
      await invoiceModel.save();
    }
    if (isLogistics) {

    }
    return 'ok';
  }

  async check() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '发票信息获取失败');
    let invoice = await ctx.model.Invoice.findById(body._id);
    if (!invoice) ctx.throw(404, '发票不存在');
    if (invoice.check) ctx.throw(422, '此发票已经审核请勿重新审核');
    await invoice.update({
      check: true
    });
    return 'ok';
  }
}
module.exports = InvoiceService;