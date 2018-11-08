const Service = require('egg').Service;

class InvoiceService extends Service {
  async setInvoiceList(type = "businessTrains", arr, updateType = 'preCheck') {
    const ctx = this.ctx;
    let req = ctx.request.body;
    let res = {
      total: 0,
      list: []
    };
    if (!(arr && arr instanceof Array && arr.length > 0)) return res;
    if (type === 'businessTrains' && req.value !== undefined) {
      let summary = await ctx.service.businessTrains.getInvoiceSummary();
      if (req.value > summary.total) ctx.throw(400, '可开票金额不足');
    }
    if (type === 'logistics' && req.value !== undefined) {
      let summary = {
        total: 0
      };
      if (req.value > summary.total) ctx.throw(400, '可开票金额不足');
    }
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      let update = {
        preCheck: {
          preInvoiced: item.preInvoiced,
        },
        checkFail: {
          preInvoiced: 0
        },
        check: {
          preInvoiced: 0,
          invoiced: {
            $inc: item.preInvoiced
          }
        }
      }
      let modelNmae = {
        businessTrains: 'BusinessTrains',
        logistics: 'Logistics'
      };
      await ctx.model[modelNmae[type]].update({
        _id: item._id
      }, update[updateType]);
      res.total += item.preInvoiced;
      res.list.push({
        _id: item._id,
        preInvoiced: item.preInvoiced
      });
    }
    return res;
  }
  async add() {
    return await this.set();
  }
  async set() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.company) ctx.throw(400, '开票公司获取失败');
    let businessTrains = await this.setInvoiceList('businessTrains', body.businessTrains, 'preCheck');
    let logistics = await this.setInvoiceList('logistics', body.logistics, 'preCheck');
    let total = businessTrains.total + logistics.total;
    if (body.value > total) ctx.throw(400, '可开票金额不足');
    if (body.value !== total) ctx.throw(400, '开票金额错误');
    if (businessTrains.list.length === 0 && logistics.list.length === 0) ctx.throw(400, '开票列表不能为空');
    let invoiceBody = {
      value: body.value,
      taxRate: body.taxRate,
      type: body.type,
      company: body.company,
      businessTrainsArr: businessTrains.list,
      logisticsArr: logistics.list,
      check: false
    };
    if (invoiceBody.value === 0) ctx.throw(400, '开票金额不能为0');
    if (['user', 'company', 'mobile'].indexOf(invoiceBody.type) < 0) ctx.throw(400, '收票方类型错误');
    if (body.toType === 'user') invoiceBody.toUser = body.toUser;
    if (body.toType === 'company') invoiceBody.toCompany = body.toCompany;
    if (body.toType === 'mobile') invoiceBody.toMobile = body.toMobile;
    if (body._id) {
      await ctx.model.Invoice.update({
        _id: body._id
      }, {
        ...invoiceBody,
        checkFail: ''
      })
    } else {
      let invoiceModel = new ctx.model.Invoice(invoiceBody);
      await invoiceModel.save();
    }
    return 'ok';
  }

  async update() {

  }

  async check() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '发票信息获取失败');
    let invoice = await ctx.model.Invoice.findById(body._id);
    if (!invoice) ctx.throw(404, '发票不存在');
    if (invoice.check) ctx.throw(422, '此发票已经审核请勿重新审核');
    await invoice.update({
      check: true,
      checkFail: ''
    });
    await this.setInvoiceList('businessTrains', invoice.businessTrainsArr, 'check');
    await this.setInvoiceList('logistics', invoice.logisticsArr, 'check');
    return 'ok';
  }

  async checkFail() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '发票信息获取失败');
    if (!body.text) ctx.throw(422, '审核错误原因尚未填写');
    let invoice = await ctx.model.Invoice.findById(body._id);
    if (!invoice) ctx.throw(404, '发票不存在');
    if (invoice.check) ctx.throw(422, '此发票已经审核');
    await invoice.update({
      check: false,
      checkFail: 'financialManager'
    });
    await this.setInvoiceList('businessTrains', invoice.businessTrainsArr, 'checkFail');
    await this.setInvoiceList('logistics', invoice.logisticsArr, 'checkFail');
    let curdLog = new ctx.model.CurdLog({
      type: 'invoiceCheckFail',
      invoice: invoice._id,
      remark: body.text
    });
    await curdLog.save();
    return 'ok';
  }
}
module.exports = InvoiceService;