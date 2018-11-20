const Service = require('egg').Service;

class CompanyService extends Service {
  async checkExisit(param, model, tip) {
    const ctx = this.ctx;
    if (!param) ctx.throw(422, `${tip}获取失败`);
    let hasData = await ctx.model[model].findById(param);
    if (!hasData) ctx.throw(404, `${tip}不存在`);
    return true;
  }
  async getModelBody(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    console.log(param);
    let modelBody = {};
    if (!(req.type === 'user' || req.type === 'company')) ctx.throw('422', '账户类型错误');
    if (req.type === 'company') {
      await this.checkExisit(req.company, 'Company', '公司');
      modelBody.company = req.company;
    }
    if (req.type === 'user') modelBody.user = ctx.user._id;
    modelBody.type = req.type;

    if (!(req.relationType === 'user' || req.relationType === 'company')) ctx.throw('422', '账户关联类型错误');
    if (req.relationUser && req.relationCompany) ctx.throw('422', '不能同时关联公司和用户');
    if (req.relationType === 'user') {
      await this.checkExisit(req.relationUser, 'User', '关联用户');
      modelBody.relationUser = req.relationUser;
    }
    if (req.relationType === 'company') {
      await this.checkExisit(req.relationCompany, 'Company', '关联公司');
      modelBody.relationCompany = req.relationCompany;
    }
    modelBody.relationType = req.relationType;
    if (req.name) modelBody.name = req.name;
    return modelBody;
  }
  async add(param) {
    return await this.set(param);
  }
  async set(param) {
    const ctx = this.ctx;
    let req = param || ctx.request.body;
    let modelBody = await this.getModelBody(req);
    let hasAccount = await ctx.model.Account.findOne(modelBody);
    if (hasAccount) return hasAccount;
    let model = new ctx.model.Account(modelBody);
    await model.save();
    return model;
  }

  async relationTab() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.company) ctx.throw('422', '公司信息获取失败');
    let company = await ctx.model.Company.findById(req.company);
    if (!company) ctx.throw('422', '公司不存在');
    let res = [];
    let accountData = await ctx.model.Account.find({
      company: company._id,
    }).populate([{
      path: 'relationUser'
    }, {
      path: 'relationCompany'
    }]);
    for (let i = 0; i < accountData.length; i++) {
      let item = JSON.parse(JSON.stringify(accountData[i]));
      if (item.relationCompany && item.relationCompany._id) {
        item.relationCompany = {
          _id: item.relationCompany._id,
          name: item.relationCompany.name || item.relationCompany.nick || item.relationCompany.code || item.relationCompany.mobile
        };
      }
      if (item.relationUser && item.relationUser._id) {
        item.relationUser = {
          _id: item.relationUser._id,
          name: item.relationUser.name || item.relationUser.nick || item.relationUser.mobile
        };
      }
      item.invoiceData = await this.settleList({
        ...item,
        withoutList: true,
        modelType: 'invoice'
      });
      res.push(item);
    }
    return res;
  }

  async settleList(params) {
    const ctx = this.ctx;
    let req = params || ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    if (!req.relationType) ctx.throw(422, '关联类型获取失败');
    if (['user', 'company'].indexOf(req.relationType) < 0) ctx.throw(422, '关联类型错误');
    if (req.relationType === 'company' && !req.relationCompany) ctx.throw(422, '关联公司信息获取失败');
    if (req.relationType === 'user' && !req.relationUser) ctx.throw(422, '关联用户信息获取失败');
    let populate = [{
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
    }];
    let list = [],
      total = 0;
    let settleType = ['BusinessTrains', 'Logistics'];
    for (let j = 0; j < settleType.length; j++) {
      const modelName = settleType[j];
      let findBody = {
        receivedCompany: req.company,
        [req.relationType]: req.relationType === 'company' ? req.relationCompany : req.relationUser
      };
      let data = await ctx.model[modelName].find(findBody).populate(populate).sort({
        createdAt: -1
      });
      for (let i = 0; i < data.length; i++) {
        let item = JSON.parse(JSON.stringify(data[i]));
        if (modelName === 'BusinessTrains') item.dataType = 'businessTrains';
        if (modelName === 'Logistics') item.dataType = 'logistics';
        let less = await ctx.service.settleRelation.getSettleLess({
          dataType: item.dataType,
          [item.dataType]: item._id,
          modelType: req.modelType
        });
        if (less !== undefined && less > 0) list.push(item);
      }
    }
    let res = {
      list,
      count: list.length,
      total
    };
    if (req.withoutList) res.list = [];
    return res;
  }

  async relationList() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    if (!req.relationType) ctx.throw(422, '收方类型获取失败');
    if (['user', 'company'].indexOf(req.relationType) < 0) ctx.throw(422, '关联类型错误');
    if (req.relationType === 'company' && !req.relationCompany) ctx.throw(422, '关联公司信息获取失败');
    if (req.relationType === 'user' && !req.relationUser) ctx.throw(422, '关联用户信息获取失败');
    let populate = [{
      path: 'toCompany'
    }, {
      path: 'toUser'
    }, {
      path: 'company'
    }, {
      path: 'user'
    }];
    let accountChangeFind = {
      isChildren: {
        $exists: false
      }
    };
    let invoiceFind = {
      isChildren: {
        $exists: false
      }
    };
    if (req.relationType === 'company') {
      accountChangeFind.company = req.relationCompany;
      accountChangeFind.toCompany = req.company;
      invoiceFind.toCompany = req.relationCompany;
      invoiceFind.company = req.company;
    }
    if (req.relationType === 'user') {
      accountChangeFind.user = req.relationUser;
      accountChangeFind.toCompany = req.company;
      invoiceFind.toUser = req.relationUser;
      invoiceFind.company = req.company;
    }
    let listTab = [{
      name: '付款流水',
      type: 'received',
      cout: 0,
      show: true,
      model: 'AccountChange',
      role: ['financialManager', 'cashier', 'invoiceCleck', 'companyAdmin'],
      find: {
        type: {
          $in: [1, 4]
        },
        check: true,
        children: {
          $exists: false
        },
        ...accountChangeFind
      }
    }, {
      name: '待审核付款流水',
      type: 'receivedCheck',
      cout: 0,
      show: true,
      model: 'AccountChange',
      role: ['financialManager', 'cashier', 'invoiceCleck', 'companyAdmin'],
      find: {
        type: {
          $in: [1, 4]
        },
        check: false,
        checkFail: '',
        ...accountChangeFind
      }
    }, {
      name: '未通过审核付款流水',
      type: 'receivedEditCheck',
      cout: 0,
      show: true,
      model: 'AccountChange',
      role: ['financialManager', 'cashier', 'invoiceCleck', 'companyAdmin'],
      find: {
        type: {
          $in: [1, 4]
        },
        check: false,
        checkFail: {
          $in: ['financialManager']
        },
        ...accountChangeFind
      }
    }, {
      name: '开票记录',
      type: 'invoice',
      cout: 0,
      show: true,
      model: 'Invoice',
      role: ['financialManager', 'cashier', 'invoiceCleck', 'companyAdmin'],
      find: {
        check: true,
        ...invoiceFind
      }
    }, {
      name: '待审核开票记录',
      type: 'invoiceCheck',
      cout: 0,
      show: true,
      model: 'Invoice',
      role: ['financialManager', 'cashier', 'invoiceCleck', 'companyAdmin'],
      find: {
        check: false,
        checkFail: '',
        ...invoiceFind
      }
    }, {
      name: '未通过审核开票记录',
      type: 'invoiceEditCheck',
      cout: 0,
      show: true,
      model: 'Invoice',
      role: ['financialManager', 'cashier', 'invoiceCleck', 'companyAdmin'],
      find: {
        check: false,
        checkFail: {
          $nin: ['']
        },
        ...invoiceFind
      }
    }];
    let listType = 'received';
    listTab.forEach((item) => {
      if (item.type === req.listType) {
        listType = item.type
      };
    });
    if (!listType) ctx.throw(422, '列表类型错误');
    let res = [];
    let currentList = [];
    for (let i = 0; i < listTab.length; i++) {
      const item = listTab[i];
      let resItem = {
        name: item.name,
        type: item.type,
        count: 0,
        list: [],
      };
      let hasRole = await ctx.model.Role.findOne({
        company: req.company,
        user: ctx.user.id,
        type: {
          $in: item.role
        }
      });
      if (!hasRole) continue;
      resItem.count = await ctx.model[item.model].count(item.find);
      if (item.type === listType) {
        let limit = Number(req.limit) || 10,
          skip = Number(req.skip) || 0;
        let listData = await ctx.model[item.model]
          .find(item.find)
          .populate(populate)
          .limit(limit)
          .skip(skip)
          .sort({
            createdAt: -1
          });
        for (let j = 0; j < listData.length; j++) {
          let listDataItem = listData[j];
          if (listDataItem.checkFail) {
            let checkFailFind = {};
            if (item.model === 'AccountChange') {
              checkFailFind.type = 'accountChangeCheckFail';
              checkFailFind.accountChange = listDataItem._id;
            }
            if (item.model === 'Invoice') {
              checkFailFind.type = 'invoiceCheckFail';
              checkFailFind.invoice = listDataItem._id;
            }
            listDataItem = JSON.parse(JSON.stringify(listData[j]));
            listDataItem.checkFailData = await ctx.model.CurdLog.findOne(checkFailFind).sort({
              createdAt: -1
            });
          }
          currentList.push(listDataItem);
        }
        resItem.list = currentList;
      }
      res.push(resItem);
    }
    if (req.onlyList) return currentList;
    return res;
  }
}
module.exports = CompanyService;