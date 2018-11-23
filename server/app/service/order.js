const Service = require('egg').Service;
const orderField = require('../field/Order');
const areaPopulate = [{
  path: 'province'
}, {
  path: 'city'
}, {
  path: 'county'
}, {
  path: 'township'
}, {
  path: 'street'
}];

class OrderService extends Service {
  async getModelBody(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req) ctx.throw(422, '订单信息未填', req);
    if (!req.state) ctx.throw(422, '未选择订单状态', req);
    if (!orderField.settlementMethod.option[req.settlementMethod]) ctx.throw(422, '非法的结算方式', req);
    if (!orderField.transportModel.option[req.transportModel]) ctx.throw(422, '非法的运输方式', req);
    if (!orderField.invoiceType.option[req.invoiceType]) ctx.throw(422, '非法的发票类型', req);
    if (!orderField.state.option[req.state]) ctx.throw(422, '非法的订单状态', req);
    if (!orderField.type.option[req.type]) ctx.throw(422, '非法的订单类型', req);
    if (req.type === 'user' && !req.user) ctx.throw(422, "未选择下单用户", req);
    if (req.type === 'company' && !req.company) ctx.throw(422, "未选择下单公司", req);
    if (!req.handle) ctx.throw(422, "处理公司获取失败", req);
    if (!req.contactName) ctx.throw(422, '未填写收货人', req);
    if (!req.contactNumber) ctx.throw(422, '未填写收货人联系电话', req);
    if (!req.area) ctx.throw(422, '未选择送货地址', req);
    if (!req.goods) ctx.throw(422, '未选择商品', req);
    let goods = await ctx.model.Goods.findById(req.goods);
    if (!goods) ctx.throw(422, '商品不存在', req);
    if (Number(req.count) <= 0) ctx.throw(422, '商品数量必须大于0', req);
    if (Number(req.factory) <= 0) ctx.throw(422, '商品出厂单价必须大于0', req);
    if (Number(req.sell) <= 0) ctx.throw(422, '商品销售单价必须大于0', req);
    let modelBody = {
      state: req.state,
      type: req.type,
      [req.type]: req[req.type],
      handle: req.handle,
      contactName: req.contactName,
      contactNumber: req.contactNumber,
      area: req.area,
      areaInfo: req.areaInfo,
      goods: req.goods,
      count: req.count,
      factory: req.factory,
      sell: req.sell,
      transport: Number(req.transport) > 0 && req.transport,
      remark: req.remark,
      deliveryTime: req.deliveryTime || new Date(),
      finishTime: req.finishTime || new Date(),
      settlementMethod: req.settlementMethod,
      transportModel: req.transportModel,
      invoiceType: req.invoiceType,
    };
    return modelBody;
  }
  async setLogistics(order, arr, transportTrains, nextTransportTrains) {
    const ctx = this.ctx;
    let logisticsCount = 0;
    if (!(Number(transportTrains.type) !== 2 && arr && arr instanceof Array && arr.length > 0)) {
      return logisticsCount;
    }
    for (let j = 0; j < arr.length; j++) {
      logisticsCount++;
      let logisticsItem = arr[j];
      this.obj2id(logisticsItem);
      if (Number(logisticsItem.landed) > Number(logisticsItem.loading)) {
        ctx.throw(422, '卸货量不能大于装货量', logisticsItem);
      }
      if (Number(logisticsItem.loss) > Number(logisticsItem.loading)) {
        ctx.throw(422, '损耗数量不能大于装货量', logisticsItem);
      }
      if (Number(logisticsItem.balanceCount) > Number(logisticsItem.loading)) {
        ctx.throw(422, '结算数量不能大于装货量', logisticsItem);
      }
      if (Number(logisticsItem.state) > 0) {
        if (!logisticsItem[logisticsItem.transportation]) {
          ctx.throw(422, '存在未填写 车/船 信息的运单', logisticsItem);
        }
      }

      if (Number(logisticsItem.state) > 1 && Number(logisticsItem.loading) <= 0) {
        ctx.throw(422, '装货量必须大于0', logisticsItem);
      }

      if (Number(logisticsItem.state) > 1 && Number(logisticsItem.landed) <= 0) {
        ctx.throw(422, '卸货量必须大于0', logisticsItem);
      }

      if (Number(logisticsItem.state) > 1 && Number(logisticsItem.price) <= 0) {
        ctx.throw(422, '运费单价必须大于0', logisticsItem);
      }

      if (!transportTrains._id) {
        ctx.throw(422, '物流链信息设置错误');
      }
      // logisticsItem.toAreaInfo = item.toAreaInfo;
      if (nextTransportTrains && Number(nextTransportTrains.areaType) === 0) {
        logisticsItem.areaArr = nextTransportTrains.areaArr;
        logisticsItem.areaInfo = nextTransportTrains.areaInfo;
      }
      if (nextTransportTrains && Number(nextTransportTrains.areaType) === 1) {
        logisticsItem.area = nextTransportTrains.area;
        logisticsItem.areaInfo = nextTransportTrains.areaInfo;
        if (nextTransportTrains.company) {
          logisticsItem.company = nextTransportTrains.company;
        }
        if (nextTransportTrains.user) {
          logisticsItem.user = nextTransportTrains.user;
        }
      }
      logisticsItem.areaType = transportTrains.areaType;
      logisticsItem.handle = order.handle;
      logisticsItem.transportTrains = transportTrains._id;
      logisticsItem.order = order._id;
      logisticsItem.contactName = order.contactName;
      logisticsItem.contactNumber = order.contactNumber;
      logisticsItem.goods = order.goods;
      if (logisticsItem._id) {
        let logistics_id = logisticsItem._id;
        delete logisticsItem.createdAt;
        delete logisticsItem.updatedAt;
        delete logisticsItem._id;
        delete logisticsItem.no;
        // logisticsItem.checkFail = "";
        await ctx.model.Logistics.update({
          _id: logistics_id
        }, logisticsItem);
      } else {
        let logisticsModel = new ctx.model.Logistics({
          no: ctx.helper.no(order.goods._id || order.goods, ctx.user._id, 6),
          ...logisticsItem
        });
        await logisticsModel.save();
      }
    }
    return logisticsCount;
  }
  obj2id(obj) {
    for (const key in obj) {
      if (JSON.stringify(obj[key]) === '{}') {
        delete obj[key];
      }
      if (obj[key] === '' || obj[key] === null) {
        delete obj[key];
      }
      if (obj[key] && obj[key]._id) {
        obj[key] = obj[key]._id;
      }
    }
    return obj;
  }
  async add(param) {
    return await this.set(param);
  }
  async set(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (req._id) return await this.update(req);
    let modelBody = await this.getModelBody(req);
    modelBody.no = await ctx.helper.no(modelBody.goods, modelBody[modelBody.type], 1);
    let order = new ctx.model.Order(modelBody);
    await order.save();
    return 'ok';
  }

  async update(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '订单信息获取失败', req);
    let oldData = await ctx.model.Order.findById(req._id);
    if (!oldData) ctx.throw(404, '订单不存在', req);
    let modelBody = await this.getModelBody(req);
    if (oldData.state !== req.state) ctx.throw(404, '订单状态不能修改', req);
    if (oldData.checkFail) {
      modelBody.$unset = {
        checkFail: 1
      }
    }
    await oldData.update(modelBody);
    return 'ok';
  }

  async updateInfo(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '订单信息获取失败', req);
    let oldData = await ctx.model.Order.findById(req._id);
    if (!oldData) ctx.throw(404, '订单不存在', req);
    let modelBody = await this.getModelBody(req);
    if (oldData.state !== req.state) ctx.throw(404, '订单状态不能修改', req);
    if (oldData.checkFail) {
      modelBody.$unset = {
        checkFail: 1
      }
    }
    await oldData.update(modelBody);
    return 'ok';
  }

  async updateBusinessTrains(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '订单信息获取失败', req);
    let oldData = await ctx.model.Order.findById(req._id);
    if (!oldData) ctx.throw(404, '订单不存在', req);
    await ctx.service.businessTrains.mutilSet(req.businessTrains, oldData);
    if (oldData.checkFail) {
      await oldData.update({
        $unset: {
          checkFail: 1
        }
      });
    }
    return 'ok';
  }

  async updateTransportTrains(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '订单信息获取失败', req);
    let oldData = await ctx.model.Order.findById(req._id);
    if (!oldData) ctx.throw(404, '订单不存在', req);
    await ctx.service.transportTrains.mutilAdd(req.transportTrains, oldData);
    if (oldData.checkFail) {
      await oldData.update({
        $unset: {
          checkFail: 1
        }
      });
    }
    return 'ok';
  }

  async transfer(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    if (!req._id) ctx.throw(422, '订单信息获取失败', req);
    if (!req.handle) ctx.throw(422, '订单转入公司必填', req);
    let oldData = await ctx.model.Order.findById(req._id);
    if (!oldData) ctx.throw(404, '订单不存在', req);
    if (oldData.state === 'dispatcher') ctx.throw(422, '订单处于调度状态,无法进行转单', req);
    let company = await ctx.model.Company.findById(req.handle);
    if (!company) ctx.throw(404, '转入公司不存在', req);
    await oldData.update({
      handle: req.handle,
      $unset: {
        checkFail: 1
      }
    });
    return 'ok';
  }

  //审核订单
  async check() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req._id) ctx.throw(422, '订单信息获取失败');
    if (!orderField.state.option[req.state]) ctx.throw(422, '非法的订单状态');
    let oldData = await ctx.model.Order.findById(req._id);
    if (!oldData) ctx.throw(422, '订单不存在');
    let newState = req.state;
    if (newState === oldData.state) ctx.throw(422, '订单已是当前审核状态,请勿重复审核');
    let hasRole = await ctx.model.Role.findOne({
      company: oldData.handle,
      user: ctx.user._id,
      type: newState
    });
    if (!hasRole) ctx.throw(400, '您的权限不足');
    if (newState === 'dispatcher') {
      if (oldData.businessTrains.length === 0) ctx.throw(400, '贸易链尚未提交');
      let hasBusinessTrains = await ctx.model.BusinessTrains.findOne({
        _id: {
          $in: oldData.businessTrains
        }
      });
      if (!hasBusinessTrains) ctx.throw(400, '请提交新的贸易链信息');
    }
    if (newState === 'dispatcherManager') {
      if (oldData.transportTrains.length === 0) ctx.throw(400, '物流链尚未提交');
      //校验物流链是否添加和物流单是否全部完成
    };
    await oldData.update({
      state: newState,
      $unset: {
        checkFail: 1
      }
    });
    return 'ok';
  }

  //订单审核失败
  async checkFail() {
    const ctx = this.ctx;
    let checkFailState = {
      salesmanManager: 'salesman',
      tradeClerk: 'salesmanManager',
      dispatcher: 'tradeClerk',
      dispatcherManager: 'dispatcher',
      logisticsClerk: 'dispatcherManager',
      documentClerk: 'logisticsClerk',
      documentClerkManager: 'documentClerk',
      financial: 'documentClerkManager'
    };
    let req = ctx.request.body;
    if (!req._id) ctx.throw(422, '订单获取失败');
    if (!req.text) ctx.throw(422, '审核失败原因必填');
    let order = await ctx.model.Order.findById(req._id);
    if (!order) ctx.throw(404, '订单信息未找到');
    if (!checkFailState[order.state]) ctx.throw(422, '当前订单无法进行回退操作');
    let hasRole = await ctx.model.Role.findOne({
      type: order.state,
      user: ctx.user._id,
      company: order.handle
    });
    if (!hasRole) ctx.throw(422, '您无权限审核');
    await order.update({
      state: checkFailState[order.state],
      checkFail: order.state
    });
    let curdLog = new ctx.model.CurdLog({
      type: 'orderCheckFail',
      user: ctx.user._id,
      company: order.handle,
      order: order._id,
      remark: req.text
    });
    await curdLog.save();
    return 'ok';
  }

  async companyBadge() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let res = [];
    let role = await ctx.model.Role.find({
      user: ctx.user._id,
    }).populate([{
      path: 'company'
    }]);
    if (!body.handle) ctx.throw(422, '当前公司信息必填');
    let appendAcitiveCompany = true;
    let companySet = new Set();
    role.forEach(item => {
      if (item.company) {
        companySet.add(item.company);
        if (item.company._id.toString() === body.handle) {
          appendAcitiveCompany = false;
        }
      }
    });
    if (appendAcitiveCompany) {
      let handle = await ctx.model.Company.findById(body.handle);
      if (!handle) {
        ctx.throw(404, '未找到当前公司');
      }
      companySet.add(JSON.parse(JSON.stringify(handle)));
    }

    let company = [...companySet];
    for (let i = 0; i < company.length; i++) {
      let item = JSON.parse(JSON.stringify(company[i]));
      let hasCompanyRole = await ctx.model.Role.find({
        type: body.state,
        user: ctx.user._id,
        company: item._id
      });
      if (hasCompanyRole.length > 0) {
        item.badge = await ctx.model.Order.count({
          state: body.state,
          handle: item._id
        });
      }
      res.push(item);
    }

    function sortId(a, b) {
      return b.badge - a.badge;
    }
    res.sort(sortId);
    return res;
  }

  async pending() {
    const ctx = this.ctx;
    let params = ctx.params;
    let body = ctx.request.body || ctx.request.query;
    let limit = Number(body.limit) || 10;
    let skip = Number(body.skip) || 0;
    let state = params.state;
    if (!body.handle) {
      ctx.throw(404, '未找到当前公司');
    }
    let handle = await ctx.model.Company.findById(body.handle);
    if (!handle) {
      ctx.throw(404, '未找到当前公司');
    }
    let role = await ctx.model.Role.find({
      type: state,
      user: ctx.user._id,
      company: body.handle
    });
    if (role.length === 0) {
      return [];
    }
    delete body.limit;
    delete body.skip;
    let orders = await ctx.model.Order.find({
      state: state,
      ...body
    }).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }, {
        path: 'company'
      }]
    }, {
      path: 'area',
      populate: areaPopulate
    }]).sort({
      updatedAt: -1
    }).limit(limit).skip(skip);

    return orders;
  }
  async getOrderById() {
    const ctx = this.ctx;
    let params = ctx.params;
    let order = await ctx.model.Order.findById(params._id).populate([{
      path: 'user'
    }, {
      path: 'company'
    }, {
      path: 'handle',
      populate: [{
        path: 'area',
        populate: areaPopulate
      }, {
        path: 'businessRelationCompany',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'transportTrainsRelationCompany',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }]
    }, {
      path: 'goods',
      populate: [{
        path: 'brand'
      }, {
        path: 'company',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'manufacturer',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }]
    }, {
      path: 'area',
      populate: areaPopulate
    }, {
      path: 'businessTrains',
      populate: [{
        path: 'user'
      }, {
        path: 'company',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'logistics',
        populate: [{
          path: 'truck'
        }, {
          path: 'ship'
        }]
      }, {
        path: 'account'
      }]
    }, {
      path: 'transportTrains',
      populate: [{
        path: 'company',
        populate: [{
          path: 'area',
          populate: areaPopulate
        }]
      }, {
        path: 'user'
      }, {
        path: 'area',
        populate: areaPopulate
      }]
    }]);
    if (!order) {
      ctx.throw(404, "未找到订单", params);
    }
    let res = JSON.parse(JSON.stringify(order));

    for (let i = 0; i < res.transportTrains.length; i++) {
      let item = res.transportTrains[i];
      item.logistics = await ctx.model.Logistics.find({
        transportTrains: item._id
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
      }, {
        path: 'balanceCompany'
      }, {
        path: 'lossCompany'
      }]);
    }
    if (res.checkFail) {
      res.checkFailData = await ctx.model.CurdLog.findOne({
        order: res._id,
        type: 'orderCheckFail'
      }).sort({
        createdAt: -1
      });
    }
    return res;
  }
  async mutilUpdate() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let newState = body.state;
    let list = body.list;
    if (!list) {
      ctx.throw(422, '未获取到需要修改的订单', body);
    }
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let _id = item._id;
      if (!_id) {
        ctx.throw(422, '未获取到需要修改的订单', body);
      }
      delete item._id;
      if (newState) {
        item.state = newState;
      }
      await ctx.model.Order.update({
        _id
      }, item);
    }
    return 'ok';
  }
}
module.exports = OrderService;