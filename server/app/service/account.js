const Service = require('egg').Service;

class CompanyService extends Service {
  async add() {
    return await this.set();
  }
  async set(data) {
    const ctx = this.ctx;
    let body = data || ctx.request.body;
    let res = {};
    if (body._id) {
      return body;
    }
    if (!(body.type === 'user' || body.type === 'company')) ctx.throw('422', '账户类型错误');
    if (!body.company) ctx.throw('422', '公司信息必填');
    if (body.type === 'user' && !body.relationUser) ctx.throw('422', '关联信息错误');
    if (body.type === 'company' && !body.relationCompany) ctx.throw('422', '关联信息错误');
    if (body.relationUser && body.relationCompany) ctx.throw('422', '不能同时关联公司和用户');
    let findBody = {
      type: body.type,
      company: body.company
    };
    if (body.payUserType === 'user') {
      let hasUser = await ctx.model.User.findById(body.user);
      if (!hasUser) ctx.throw(404, '付款人不存在');
      findBody.relationUser = body.relationUser;
    }
    if (body.payUserType === 'company') {
      let hasCompany = await ctx.model.Company.findById(body.company);
      if (!hasCompany)
        findBody.relationCompany = body.relationCompany;
      if (body.relationCompany === body.company) return {};
    }
    let hasAccount = await ctx.model.Account.findOne(findBody);
    if (hasAccount) {
      return hasAccount;
    }
    let model = new ctx.model.Account(body);
    await model.save();
    res = await ctx.model.Account.findById(model._id);
    return res;
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
      $or: [{
          relationCompany: {
            $exists: true
          }
        },
        {
          relationUser: {
            $exists: true
          }
        }
      ]
    }).populate([{
      path: 'relationUser'
    }, {
      path: 'relationCompany'
    }]);
    for (let i = 0; i < accountData.length; i++) {
      const item = accountData[i];
      let resItem = {
        value: item.value,
        prepaid: item.prepaid
      };
      if (item.relationCompany && item.relationCompany._id) {
        resItem._id = item.relationCompany._id;
        resItem.name = item.relationCompany.name || item.relationCompany.nick || item.relationCompany.code || item.relationCompany.mobile;
      }
      if (item.relationUser && item.relationUser._id) {
        resItem.isUser = true;
        resItem._id = item.relationUser._id;
        resItem.name = item.relationUser.name || item.relationUser.nick || item.relationUser.mobile;
      }
      let findBody = {
        company: company._id,
        relationType: item.type,
        withoutList: true
      };
      if (findBody.relationType === 'company') findBody.relationCompany = item.relationCompany._id;
      if (findBody.relationType === 'user') findBody.relationUser = item.relationUser._id;
      resItem.waitingForInvoice = await this.waitingForInvoice(findBody);
      res.push(resItem);
    }
    return res;
  }

  async waitingForInvoice(params) {
    const ctx = this.ctx;
    let req = params || ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    if (!req.relationType) ctx.throw(422, '收方类型获取失败');
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
        if (modelName === 'BusinessTrains') item.isBusinessTrains = true;
        if (modelName === 'Logistics') item.isLogistics = true;
        let invoicedLess = item.balancedSettlement + item.balancedPrepaid - item.invoiced - item.preInvoiced;
        if (req.withoutInvoiced) { //修改发票时,preInvoiced排除
          invoicedLess += item.preInvoiced;
        }
        total += invoicedLess;
        if (invoicedLess > 0) list.push(item);
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
          .skip(skip);
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