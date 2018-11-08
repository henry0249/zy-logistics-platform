const Service = require('egg').Service;

class InvoiceService extends Service {
  async getInvoiceTab() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    let res = [];
    let type = req.type || 'businessTrains';
    if (['businessTrains', 'logistics'].indexOf(type) < 0) return res;
    if (type === 'businessTrains') {
      let businessTrainsData = await ctx.model.BusinessTrains.find({
        receivedCompany: req.company
      }).populate([{
        path: 'company'
      }, {
        path: 'user'
      }]);
      businessTrainsData.forEach(item => {
        let resItem = {};
        if (item.company && item.company._id) {
          resItem._id = item.company._id;
          resItem.name = item.company.name || item.company.nick || item.company.code || item.company.mobile;
        }
        if (item.user && item.user._id) {
          resItem.isUser = true;
          resItem._id = item.user._id;
          resItem.name = item.user.name || item.user.nick || item.user.mobile;
        }
        if (resItem._id) res.push(resItem);
      });
    }
    if (type === 'logistics') {
      let logisticsData = await ctx.model.Logistics.find({
        receivedCompany: req.company
      }).populate([{
        path: 'truck',
        populate: [{
          path: 'company'
        }]
      }, {
        path: 'ship',
        populate: [{
          path: 'company'
        }]
      }]);
      logisticsData.forEach(item => {
        let resItem = {};
        let company = {};
        if (item.truck && item.truck.company && item.truck.company._id) {
          company = item.truck.company;
          resItem._id = item.company._id;
        }
        if (item.ship && item.ship.company && item.ship.company._id) {
          company = item.ship.company;
        }

        resItem._id = company._id;
        resItem.name = company.name || company.nick || company.code || company.mobile;
        if (resItem._id) res.push(resItem);
      });
    }
    return ctx.helper.unique(res, '_id');
  }
  async getInvoiceList(params) {
    const ctx = this.ctx;
    let req = params || ctx.request.body;
    if (!req.fromCompany) ctx.throw(422, '开票公司信息获取失败');
    if (!req.toType) ctx.throw(422, '收票方类型获取失败');
    if (['user', 'company'].indexOf(type) < 0) ctx.throw(422, '收票方类型错误');
    if (req.toType === 'company' && !req.toCompany) ctx.throw(422, '收票公司信息获取失败');
    if (req.toType === 'user' && !req.toUser) ctx.throw(422, '收票人信息获取失败');
    let res = [],
      type = req.type || 'businessTrains',
      limit = req.limit || 10,
      skip = req.skip || 0;
    if (['businessTrains', 'logistics'].indexOf(type) < 0) return res;
    if (type === 'businessTrains') {
      let businessTrainsData = await ctx.model.BusinessTrains.find({
        receivedCompany: req.fromCompany,
        [req.toType]: req.toType === 'company' ? req.toCompany : req.toUser
      }).populate([{
        path: 'order'
      }, {
        path: 'goods',
        populate: [{
          path: 'brand'
        }]
      }, {
        path: 'company'
      }, {
        path: 'receivedCompany'
      }, {
        path: 'user'
      }]).sort({
        createdAt: -1
      }).limit(limit).skip(skip);
      for (let i = 0; i < businessTrainsData.length; i++) {
        let item = JSON.parse(JSON.stringify(data[i]));
        item.isBusinessTrains = true;
        let invoicedLess = item.balancedSettlement + item.balancedPrepaid - item.invoiced - item.preInvoiced;
        if (invoicedLess > 0) res.push(item);
      }
    }
    if (type === 'logistics') {
      if (req.toCompany) ctx.throw(422, '收票公司信息获取失败');
      let logisticsData = await ctx.model.Logistics.find({
        receivedCompany: req.company,
        balanceCompany: req.toCompany
      }).populate([{
        path: 'receivedCompany'
      }, {
        path: 'balanceCompany'
      }, {
        path: 'truck',
        populate: [{
          path: 'company'
        }]
      }, {
        path: 'ship',
        populate: [{
          path: 'company'
        }]
      }]).sort({
        createdAt: -1
      }).limit(limit).skip(skip);
      for (let i = 0; i < logisticsData.length; i++) {
        let item = JSON.parse(JSON.stringify(data[i]));
        item.isLogistics = true;
        let invoicedLess = item.balancedSettlement + item.balancedPrepaid - item.invoiced - item.preInvoiced;
        if (invoicedLess > 0) res.push(item);
      }
    }
    return res;
  }
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