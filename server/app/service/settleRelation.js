const Service = require('egg').Service;
const settleRelationField = require('../field/SettleRelation');

class SettleRelationService extends Service {
  async mutilAdd(param) {
    return this.mutilSet(param);
  }
  async mutilSet(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req instanceof Array && req.length > 0)) return [];
    let res = [];
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      let data = await this.set(item);
      if (data) res.push(data._id);
    }
    if (res.length > 0) {
      if (req[0].modelType === 'accountChange') {
        await ctx.model.AccountChange.update({
          _id: req[0].accountChange
        }, {
          settleRelation: res
        });
      }
      if (req[0].modelType === 'invoice') {
        await ctx.model.Invoice.update({
          _id: req[0].invoice
        }, {
          settleRelation: res
        });
      }
    }
    return res;
  }
  async add(param) {
    return this.set(param);
  }
  async set(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    let modelBody = {};
    if (!settleRelationField.dataType.option[req.dataType]) ctx.throw(422, "数据类型错误", req);
    if (!settleRelationField.modelType.option[req.modelType]) ctx.throw(422, "模型类型错误", req);
    if (req.businessTrains && req.logistics) ctx.throw(422, "不能同时包含贸易节点和物流单", req);
    if (!req[req.dataType]) ctx.throw(422, "数据获取失败", req);
    let data;
    if (req.dataType === 'businessTrains') data = await ctx.model.BusinessTrains.findById(req.businessTrains);
    if (req.dataType === 'logistics') data = await ctx.model.Logistics.findById(req.logistics);
    if (!data) ctx.throw(422, "贸易节点或物流单数据不存在", req);
    if (data.order) modelBody.order = data.order;
    if (data.goods) modelBody.goods = data.goods;
    modelBody.dataType = req.dataType;
    modelBody.modelType = req.modelType;
    modelBody[req.dataType] = req[req.dataType];
    if (req._id) {
      this.setValue(modelBody);
      await ctx.model.SettleRelation.update({
        _id: req._id
      }, modelBody);
      res = req;
    } else {
      this.setValue(modelBody, 'init');
      let model = new ctx.model.SettleRelation(modelBody);
      await model.save();
      res = model;
    }
    return res;
  }
  async updateBusinessTrainsOrLogistics(item) {
    const ctx = this.ctx;
    let modelName;
    if (item.modelType === 'accountChange') modelName = 'AccountChange';
    if (item.modelType === 'invoice') modelName = 'Invoice';
    let updateToReal = false;
    if (item[item.modelType]) {
      let data = await ctx.model[modelName].findById(item[item.modelType]);
      if (data) ctx.throw(404, "流水或发票数据不存在", req);
      if (data.check) {
        updateToReal = true
      }
    }
    let update = {};
    let oldBalancedSettlement = 0,
      oldBalancedPrepaid = 0,
      oldInvoiced = 0,
      balancedLess = 0,
      invoicedLess = 0;
    if (item._id) {
      let oldItem = await ctx.model.SettleRelation.findById(item._id)
        .populate([{
          path: 'businessTrains'
        }, {
          path: 'logistics'
        }]);
      if (oldItem && oldItem.dataType === 'businessTrains') {
        oldBalancedSettlement = oldItem.balancedSettlement;
        oldBalancedPrepaid = oldItem.balancedPrepaid;
      }
      if (oldItem && oldItem.dataType === 'logistics') {
        oldInvoiced = oldItem.invoiced;
      }
      if (oldItem && oldItem.businessTrains) {
        balancedLess = oldItem.businessTrains.balancePrice *
          oldItem.businessTrains.balanceCount -
          oldItem.businessTrains.balancedSettlement -
          oldItem.businessTrains.balancedPrepaid;
      }
      if (oldItem && oldItem.logistics) {
        invoicedLess = oldItem.logistics.balancedSettlement +
          oldItem.logistics.balancedPrepaid;
      }
    }

    if (item.dataType === 'businessTrains') {
      if (updateToReal) {
        update.$inc = {
          balancedSettlement: item.balancedSettlement - oldBalancedSettlement,
          balancedPrepaid: item.balancedPrepaid - oldBalancedPrepaid,
          preSettlement: -(item.balancedPrepaid - oldBalancedPrepaid),
          prePrepaid: -(item.balancedPrepaid - oldBalancedPrepaid),
        }
      } else {
        update.$inc = {
          preSettlement: item.balancedPrepaid - oldBalancedPrepaid,
          prePrepaid: item.balancedPrepaid - oldBalancedPrepaid,
        }
      }
    }
    if (item.dataType === 'logistics') {
      if (updateToReal) {
        update.$inc = {
          invoiced: item.invoice,
          preInvoiced: -oldInvoiced,
        };
      } else {
        update.$inc = {
          preInvoiced: item.invoiced - oldInvoiced,
        };
      }
    }
  }
  setValue(item, init) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (item.modelType === 'accountChange') {
      let preSettlement = Number(req.preSettlement),
        prePrepaid = Number(req.prePrepaid);
      if (init && preSettlement === 0 && prePrepaid === 0) ctx.throw(400, '使用预付款和使用结算款不能同时为0');
      item.balancedSettlement = preSettlement;
      item.balancedPrepaid = prePrepaid;
      return preSettlement !== 0 || prePrepaid !== 0;
    }
    if (item.modelType === 'accountChange') {
      let invoiced = Number(req.invoiced);
      if (init && invoiced === 0) ctx.throw(400, '开票金额不能为0');
      item.invoiced = invoiced;
      return invoiced !== 0;
    }
  }
}
module.exports = SettleRelationService;