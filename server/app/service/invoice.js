const Service = require('egg').Service;

class InvoiceService extends Service {
  async add(param) {
    return await this.set(param);
  }
  async set(param) {
    const ctx = this.ctx;
    let body = param || ctx.request.body;
    let invoiceBody = {
      value: body.value,
      taxRate: body.taxRate,
      type: body.type,
      company: body.company,
      handle: body.company,
      check: false,
      toType: body.toType,
      from: body.from,
      to: body.to,
      contactNumber: body.contactNumber,
      address: body.address,
      billingDate: new Date(body.billingDate)
    };
    if (!invoiceBody.company) ctx.throw(400, '开票公司获取失败');
    if (invoiceBody.value === 0) ctx.throw(400, '开票金额不能为0');
    if (['user', 'company', 'mobile'].indexOf(invoiceBody.toType) < 0) ctx.throw(400, '收票方类型错误');
    if (body.toType === 'user' && !body.toUser) ctx.throw(400, '收票用户获取失败');
    if (body.toType === 'company' && !body.toCompany) ctx.throw(400, '收票公司获取失败');
    if (body.toType === 'mobile' && !body.toMobile) ctx.throw(400, '收票手机号获取失败');
    if (!body.contactNumber) ctx.throw(400, '联系电话必填');
    if (!body.address) ctx.throw(400, '地址必填');
    if (!body.billingDate) ctx.throw(400, '开票日期必填');
    if (body.toType === 'user') invoiceBody.toUser = body.toUser;
    if (body.toType === 'company') invoiceBody.toCompany = body.toCompany;
    if (body.toType === 'mobile') invoiceBody.toMobile = body.toMobile;
    await ctx.service.settleRelation.mutilSetCheck(body.settleRelation);
    if (body._id) {
      await ctx.model.Invoice.update({
        _id: body._id
      }, {
        ...invoiceBody,
        checkFail: ''
      });
      await ctx.service.settleRelation.mutilSet(body.settleRelation, body._id);
      return body._id;
    } else {
      let invoiceModel = new ctx.model.Invoice(invoiceBody);
      await invoiceModel.save();
      await ctx.service.settleRelation.mutilSet(body.settleRelation, invoiceModel._id);
      return invoiceModel._id;
    }
  }

  async update() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '发票信息获取失败');
    let invoice = await ctx.model.Invoice.findById(body._id);
    if (!invoice) ctx.throw(404, '发票不存在');
    if (invoice.isChildren) ctx.throw(422, '此发票仅做备份,不能修改');
    let isFinancialManager = await ctx.model.Role.findOne({
      type: 'financialManager',
      user: ctx.user._id,
      company: invoice.handle || invoice.company
    });
    if (isFinancialManager) {
      await this.set();
    } else {
      body.isChildren = true;
      delete body._id;
      let childrenId = await this.set(body);
      await invoice.update({
        children: childrenId
      });
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
    if (invoice.children) {
      await ctx.service.curd.delete(ctx.model.Invoice, {
        _id: invoice.children
      });
    }
    await this.set({
      ...body,
      check: true,
      checkFail: '',
      $unset: {
        children: 1
      }
    });
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
    let curdLog = new ctx.model.CurdLog({
      type: 'invoiceCheckFail',
      invoice: invoice._id,
      remark: body.text
    });
    await curdLog.save();
    return 'ok';
  }

  async delete() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body._id) ctx.throw(422, '发票信息获取失败');
    let invoice = await ctx.model.Invoice.findById(body._id);
    if (!invoice) ctx.throw(404, '发票不存在');
    if (invoice.check) ctx.throw(404, '发票已经审核,不能删除');
    await ctx.service.curd.delete(ctx.model.Invoice, {
      _id: invoice.children
    });
    await ctx.service.curd.delete(ctx.model.SettleRelation, {
      _id: {
        $in: [invoice.settleRelation]
      },
      mutil: true
    });
    await ctx.service.curd.delete(ctx.model.Invoice, {
      _id: body._id
    });
    return 'ok';
  }
}
module.exports = InvoiceService;