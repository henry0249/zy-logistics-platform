const Service = require('egg').Service;

class SettleRelationService extends Service {
  async mutilAdd(param, updateType, updateToRealData) {
    return this.mutilSet(param, updateType, updateToRealData);
  }
  async mutilSet(param, updateType, updateToRealData) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req instanceof Array && req.length > 0)) return [];
    let res = [];
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      let data = await this.set(item, updateType, updateToRealData);
      if (data) res.push(data._id);
    }
    return res;
  }
  async add(param, updateType, updateToRealData) {
    return this.set(param, updateType, updateToRealData);
  }
  async set(param, updateType = 'accountChange', updateToRealData = 'update') {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    let modelBody = {};
    if (updateType === 'accountChange') {
      modelBody.accountChange = req.accountChange; //关联流水
      modelBody.balancedSettlement = Number(req.preSettlement);
      modelBody.prepaid = Number(req.prePrepaid);
    }
    if (updateType === 'invoice') {
      modelBody.invoice = req.invoice; //关联发票
      modelBody.invoiced = Number(req.preInvoiced);
    }
    let data = ctx.model.BusinessTrains.findById(req._id);
    if (data) modelBody.type = 'businessTrains';
    if (!data) {
      data = ctx.model.Logistics.findById(req._id);
      if (data) modelBody.type = 'logistics';
    }
    modelBody[modelBody.type] = req._id;
    if (data && data.order) modelBody.order = data.order;
    if (data && data.goods) modelBody.goods = data.goods;
    let hasData = await ctx.model.SettleRelation.findOne({
      type: modelBody.type,
      order: modelBody.order,
      [modelBody.type]: req._id
    });
    let res;
    if (hasData) {
      await hasData.update(modelBody);
      res = hasData;
    } else {
      let model = new ctx.model.SettleRelation(modelBody);
      await model.save();
      res = model;
    }
    if (updateToRealData === 'update' || updateToRealData === 'delete') {
      let update = {
        $inc: {}
      };
      if (updateType === 'accountChange') {
        update.$inc = {
          balancedSettlement: modelBody.balancedSettlement,
          prepaid: modelBody.prepaid
        }
      }
      if (updateType === 'accountChange') {
        update.$inc = {
          invoiced: modelBody.invoiced
        }
      }
      await data.update(update)
    }
    return res;
  }
}
module.exports = SettleRelationService;