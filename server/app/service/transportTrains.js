const Service = require('egg').Service;
const field = require('../field/TransportTrains');

class MyService extends Service {
  get transportTrainsModel() {
    return this.ctx.model.TransportTrains;
  }
  async getProperty(param) {
    const ctx = this.ctx;
    let req = param;
    if (!req) ctx.throw(422, '贸易数据获取错误');
    let property = {};
    if (!field.type.option[req.type]) ctx.throw(422, '物流节点类型错误', req);
    property.type = req.type;
    if (!field.areaType.option[req.areaType]) ctx.throw(422, '物流节点地址类型错误', req);
    req.areaType = Number(req.areaType);
    property.areaType = req.areaType;
    if (req.areaType === 0) {
      if (!(req.areaArr && req.areaArr instanceof Array && req.areaArr.length > 0)) ctx.throw(422, '物流节点地址未选择', req);
      property.areaArr = req.areaArr;
    }
    if (req.areaType === 1) {
      if (!req.area) ctx.throw(422, '公司地址信息获取失败', req);
      property.area = req.area;
      if (req.company) property.company = req.company;
    }
    if (!req.order) ctx.throw(422, '物流节点订单信息获取失败', req);
    property.order = req.order;
    if (!req.goods) ctx.throw(422, '物流节点商品信息获取失败', req);
    property.goods = req.goods;
    if (!req.handle) ctx.throw(422, '物流节点处理公司获取失败', req);
    property.handle = req.handle;
    if (!req.areaInfo) ctx.throw(422, '物流节点地址详情必填', req);
    property.areaInfo = req.areaInfo;
    if (req.type !== 2) {
      if (!req.nextAreaInfo) ctx.throw(422, '物流节点目的地址详情必填', req);
      property.nextAreaInfo = req.nextAreaInfo;
    }
    if (req.carrierCompany) property.carrierCompany = req.carrierCompany;
    if (req.last) property.last = req.last;
    if (req.next) property.next = req.next;
    if (req.remark) property.remark = req.remark;
    return property;
  }

  async set(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    let property = await this.getProperty(req);
    if (req.justCheck) return;
    let hasData = this.transportTrainsModel.findOne(property);
    if (hasData) ctx.throw(400, '已经存在相同数据,请勿重复添加');
    property.no = await ctx.helper.no(property.order, property.handle, 3);
    let newModel = new this.transportTrainsModel(property);
    await newModel.save();
    return newModel;
  }

  async update(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '_id必填', req);
    let data = await this.transportTrainsModel.findById(req._id);
    if (!data) ctx.throw(422, '数据未找到', req);
    let property = await this.getProperty(req);
    if (req.justCheck) return;
    if (data.checkFail) {
      property.$unset = {
        checkFail: 1
      };
    }
    await data.update(property);
    return data;
  }

  async add(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (req._id) return await this.update(req);
    let property = await this.getProperty(req);
    if (req.justCheck) return;
    property.no = await ctx.helper.no(property.order, property.handle, 3);
    let newModel = new this.transportTrainsModel(property);
    await newModel.save();
    return newModel;
  }

  async mutilAdd(param, orderInfo) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req) ctx.throw(422, '物流链尚未添加', req);
    if (!(req instanceof Array)) ctx.throw(422, '物流链必须是数组', req);
    if (req.length < 2) ctx.throw(422, '物流链至少两个节点', req);
    if (!orderInfo) ctx.throw(422, '物流节点订单信息获取失败', req);
    if (!orderInfo._id) ctx.throw(422, '物流节点订单信息获取失败', req);
    if (!orderInfo.goods) ctx.throw(422, '物流节点商品信息获取失败', req);
    if (!orderInfo.handle) ctx.throw(422, '物流节点处理公司获取失败', req);
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      if (i === 0) item.type = 0;
      if (i === req.length - 1) item.type = 2;
      if (i !== 0 && i !== req.length - 1) item.type = 1;
      if (req[i + 1]) item.nextAreaInfo = req[i + 1].areaInfo;
      if (req[i - 1] && req[i - 1]._id) item.last = req[i - 1]._id;
      if (req[i + 1] && req[i + 1]._id) item.next = req[i + 1]._id;
      item.order = orderInfo._id;
      item.goods = orderInfo.goods;
      item.handle = orderInfo.handle;
      await this.add({
        ...item,
        justCheck: true
      });
    }
    let res = [];
    for (const item of req) {
      let data = await this.add(item);
      if (data._id) res.push(data._id);
    }
    await ctx.model.Order.update({
      _id: orderInfo._id
    }, {
      transportTrains: res
    });
  }

  async delete(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '删除参数不完整', req);
    await ctx.service.curd.delete(ctx.model.BusinessTrains, {
      _id: req._id
    });
    await ctx.service.curd.delete(ctx.model.Stock, {
      businessTrains: req._id,
      multi: true,
      check: false
    });
    return 'ok';
  }
  async updateBalancePrice(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req._id && item.balancePrice !== undefined && Number(item.balancePrice) > 0)) return;
    await ctx.model.BusinessTrains.update({
      _id: req._id
    }, {
      balancePrice: item.balancePrice
    });
    return 'ok';
  }
  async mutilUpdateBalancePrice(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!(req && req instanceof Array && req.length > 0));
    req.forEach(item => {
      if (!item._id) ctx.throw('贸易节点信息获取失败');
      if (!(item.balancePrice !== undefined && Number(item.balancePrice) > 0)) ctx.throw('结算价格必须大于0');
    });
    for (let i = 0; i < req.length; i++) {
      const item = req[i];
      await this.updateBalancePrice(item);
    }
    return 'ok';
  }

}
module.exports = MyService;