const Service = require('egg').Service;

class jwtService extends Service {
  async sign(user, option = {}) {
    const ctx = this.ctx;
    let token = await ctx.helper.jwtSign(user, option);
    let uaObj = ctx.helper.ua();
    let tokenData = await ctx.model.Jwt.findOne({
      user: user._id
    });
    if (tokenData) {
      let update = {
        ...token,
        $addToSet: {
          ualist: uaObj
        },
        ua: uaObj,
        loginAt: new Date(),
        ...option
      };
      if (!option.company) {
        update.$unset = {
          company: 1
        }
      }
      if (!option.platform) {
        update.$unset = {
          platform: 1
        }
      }
      await tokenData.update(update);
    } else {
      let newTokenData = new ctx.model.Jwt({
        ...token,
        user: user._id,
        ua: uaObj,
        loginAt: new Date(),
        ...option
      })
      await newTokenData.save();
      await newTokenData.update({
        $addToSet: {
          ualist: uaObj
        }
      });
    }
    return token;
  }
  async verify() {
    const ctx = this.ctx;
    let {
      header,
      body,
    } = ctx.request;
    let token = header.authorization || body.token;
    await ctx.helper.jwtVerify(token);
    let tokenData = await ctx.model.Jwt.findOne({
      value: token
    }).populate([{
      path: 'user'
    }, {
      path: 'company',
      // populate: [{
      //   name: '管理员',
      //   path: 'admin'
      // }, {
      //   name: '业务专员',
      //   path: 'salesman'
      // }, {
      //   name: '财务文员',
      //   path: 'financial'
      // }]
    }, {
      path: 'platform',
      // populate: [{
      //   name: '管理员',
      //   path: 'admin'
      // }, {
      //   name: '市场专员',
      //   path: 'salesman'
      // }, {
      //   name: '审核员',
      //   path: 'auditor'
      // }, {
      //   name: '物流专员',
      //   path: 'dispatcher'
      // }, {
      //   name: '单据文员',
      //   path: 'documentClerk'
      // }, {
      //   name: '财务专员',
      //   path: 'financial'
      // }]
    }]);
    if (!tokenData) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let dayjs = require('dayjs');
    let refleshRange = dayjs(tokenData.expAt).diff(dayjs(), 'second');
    if (refleshRange > 0 && refleshRange <= 600) {
      let option = {};
      if (!ctx.tokenData) {
        ctx.throw(401, '登录已失效,请尝试重新登录');
      }
      if (ctx.tokenData.company) {
        option.company = ctx.tokenData.company;
      }
      if (ctx.tokenData.platform) {
        option.platform = ctx.tokenData.platform;
      }
      option.sys = ctx.tokenData.sys;
      let newToken = await this.sign(tokenData.user, option);
      ctx.set({
        refleshRange,
        refleshtoken: newToken.value,
        tokenexp: newToken.expAt
      });
    }
    return tokenData;
  }
  async reflesh() {
    const ctx = this.ctx;
    let {
      header,
      body,
    } = ctx.request;
    let token = header.authorization || body.token;
    let tokenData = await ctx.model.Jwt.findOne({
      value: token
    });
    if (!tokenData) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let dayjs = require('dayjs');
    let refleshRange = dayjs(tokenData.expAt).diff(dayjs(), 'second');
    if (refleshRange > 0 && refleshRange <= 600) {
      let user = await ctx.helper.jwtVerify(token);
      return await this.sign(user);
    }
    return {
      refleshRange: refleshRange,
      token: tokenData.value,
      exp: tokenData.expAt
    };
  }
}
module.exports = jwtService;