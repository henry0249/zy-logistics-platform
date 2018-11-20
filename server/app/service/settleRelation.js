const Service = require('egg').Service;
const settleRelationField = require('../field/SettleRelation');

class SettleRelationService extends Service {

  async getModelBody(param, modelDataId) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    let modelBody = {};
    if (!settleRelationField.dataType.option[req.dataType]) ctx.throw(422, "数据类型错误", req);
    if (!settleRelationField.modelType.option[req.modelType]) ctx.throw(422, "模型类型错误", req);
    if (req.businessTrains && req.logistics) ctx.throw(422, "不能同时包含贸易节点和物流单", req);
    if (!req[req.dataType]) ctx.throw(422, "数据获取失败", req);
    let data, modelData;
    if (req.dataType === 'businessTrains' && !req.businessTrains) ctx.throw(422, "贸易单数据获取失败", req);
    if (req.dataType === 'logistics' && !req.logistics) ctx.throw(422, "物流单数据获取失败", req);
    // if (req.modelType === 'accountChange' && !req.accountChange) ctx.throw(422, "流水记录数据获取失败", req);
    // if (req.modelType === 'invoice' && !req.invoice) ctx.throw(422, "发票记录数据获取失败", req);
    if (req.dataType === 'businessTrains') data = await ctx.model.BusinessTrains.findById(req.businessTrains);
    if (req.dataType === 'logistics') data = await ctx.model.Logistics.findById(req.logistics);
    if (!data) ctx.throw(422, `${req.dataType === 'logistics'?'物流单':'贸易单'}数据不存在`, req);
    if (req.dataType === 'accountChange') modelData = await ctx.model.AccountChange.findById(modelDataId);
    if (req.dataType === 'invoice') modelData = await ctx.model.Invoice.findById(modelDataId);
    // if (!modelData) ctx.throw(422, `${req.dataType === 'invoice'?'发票':'流水'}数据不存在`, req);
    if (modelData && modelData.isChildren) modelBody.isChildren = true;
    if (data.order) modelBody.order = data.order;
    if (data.goods) modelBody.goods = data.goods;
    modelBody.dataType = req.dataType;
    modelBody.modelType = req.modelType;
    modelBody[req.dataType] = req[req.dataType];
    if (req._id) modelBody._id = req._id;
    return modelBody;
  }
  async mutilSetCheck(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req instanceof Array && req.length > 0)) return [];
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      await this.getModelBody(item);
      await this.setValue(item);
    }
  }
  async mutilAdd(param, _id) {
    return this.mutilSet(param, _id);
  }
  async mutilSet(param, modelDataId) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req instanceof Array && req.length > 0)) return [];
    let res = [];
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      let data = await this.set(item, modelDataId);
      if (data && data._id) res.push(data._id);
    }
    if (res.length === 0) return res;
    let modelType = req[0].modelType,
      modelName = 'AccountChange';
    if (modelType === 'invoice') modelName = 'Invoice';
    let modelData = await ctx.model[modelName].findById(modelDataId);
    if (!modelData) return res;
    await modelData.update({
      settleRelation: res
    });
    return res;
  }
  async add(param) {
    return this.set(param);
  }
  async set(param, modelDataId) {
    const ctx = this.ctx;
    let modelBody = await this.getModelBody(param || ctx.request.body, modelDataId);
    let res;
    if (modelBody._id) {
      let value = await this.setValue(modelBody);
      await updateBusinessTrainsOrLogistics(modelBody, value);
      if (value.value === 0) {
        await ctx.service.curd.delete({
          _id: modelBody._id
        });
        return;
      };
      let _id = modelBody._id;
      delete modelBody._id;
      await ctx.model.SettleRelation.update({
        _id: _id
      }, modelBody);
      res = modelBody;
    } else {
      let value = await this.setValue(modelBody);
      await updateBusinessTrainsOrLogistics(modelBody, value);
      let model = new ctx.model.SettleRelation(modelBody);
      await model.save();
      res = model;
    }
    return res;
  }
  async updateBusinessTrainsOrLogistics(item, input) {
    const ctx = this.ctx;
    let modelName, dataModelName;
    if (item.modelType === 'accountChange') modelName = 'AccountChange';
    if (item.modelType === 'invoice') modelName = 'Invoice';
    if (item.dataType === 'businessTrains') dataModelName = 'BusinessTrains';
    if (item.dataType === 'logistics') dataModelName = 'Logistics';
    let hasCheck = false;
    if (item[item.modelType]) {
      if (!item[item.modelType]) ctx.throw(404, "流水或发票数据获取失败");
      let modelData = await ctx.model[modelName].findById(item[item.modelType]);
      if (!modelData) ctx.throw(404, "流水或发票数据不存在");
      if (modelData.check) hasCheck = true;
    }
    if (!hasCheck) return;
    if (!item[item.dataType]) ctx.throw(404, "贸易单或物流单数据获取失败");
    let data = await ctx.model[dataModelName].findById(item[item.dataType]);
    if (!data) ctx.throw(404, "贸易单或物流单数据不存在");
    delete input.value;
    let update = {
      $inc: input
    };
    if (item._id) {
      let oldItem = await ctx.model.SettleRelation.findById(item._id);
      if (item.modelType === 'accountChange') {
        update.balancedSettlement -= oldItem.balancedSettlement;
        update.balancedPrepaid -= oldItem.balancedPrepaid;
      }
      if (item.modelType === 'invoice') {
        update.invoiced -= oldItem.invoiced;
      }
    }
    await data.update(update);
  }
  async setValue(item) {
    const ctx = this.ctx;
    let isInit = item._id === undefined;
    let data = 0;
    if (item.modelType === 'accountChange') {
      let balancedSettlement = Number(item.balancedSettlement),
        balancedPrepaid = Number(item.balancedPrepaid);
      if (isInit && balancedSettlement === 0 && balancedPrepaid === 0) ctx.throw(400, '使用预付款和使用结算款不能同时为0');
      data = item.balancedSettlement + item.balancedPrepaid;
    }
    if (item.modelType === 'invoice') {
      let invoiced = Number(item.invoiced);
      if (isInit && invoiced === 0) ctx.throw(400, '开票金额不能为0');
      data = item.invoiced;
    }
    let less = await this.getSettleLess(item);
    if (data > less) ctx.throw(400, `${item.modelType === 'accountChange'?'可结算':'可开票'}金额不足`);
    if (item.modelType === 'accountChange') {
      return {
        balancedSettlement: item.balancedSettlement,
        balancedPrepaid: item.balancedPrepaid,
        value: data
      }
    }
    return {
      invoiced: item.invoiced,
      value: data
    };
  }
  async getSettleLess(item) {
    const ctx = this.ctx;
    let dataModelName;
    if (item.dataType === 'businessTrains') dataModelName = 'BusinessTrains';
    if (item.dataType === 'logistics') dataModelName = 'Logistics';
    let data = await ctx.model[dataModelName].findById(item[item.dataType]);
    if (!data) ctx.throw(422, '数据获取失败');
    let res = 0;
    if (item.modelType === 'accountChange') {
      res = data.balanceCount * data.balancePrice - (data.balancedSettlement + data.balancedPrepaid);
    }
    if (item.modelType === 'invoice') {
      res = data.balancedSettlement + data.balancedPrepaid - data.invoiced;
    }
    let settleRelationData = await ctx.model.SettleRelationData({
      [dataType]: item[item.dataType],
      $or: [{
        isChildren: false
      }, {
        isChildren: {
          $exists: false
        }
      }]
    });
    settleRelationData.map((settleRelationItem) => {
      if (settleRelationItem._id !== item._id) {
        if (modelType === 'accountChange') {
          res -= settleRelationItem.invoiced;
        }
        if (modelType === 'invoice') {
          res -= (settleRelationItem.balancedSettlement + settleRelationItem.balancedPrepaid);
        }
      }
    });
    return res;
  }
}
module.exports = SettleRelationService;