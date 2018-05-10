const Service = require('egg').Service;

class jwtService extends Service {
  async sign(user) {
    const {
      ctx
    } = this;
    let token = await ctx.helper.jwtSign(user);
    let uaObj = ctx.helper.ua();
    let tokenData = await ctx.model.Jwt.findOne({
      user: user._id
    });
    if (tokenData) {
      await tokenData.update({
        ...token,
        $addToSet: {
          ualist: uaObj
        },
        ua: uaObj,
        loginAt: new Date()
      })
    } else {
      let newTokenData = new ctx.model.Jwt({
        ...token,
        user: user._id,
        ua: uaObj,
        loginAt: new Date()
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
    const {
      ctx
    } = this;
    let {
      header,
      body,
    } = ctx.request;
    let token = header.authorization || body.token;
    await ctx.helper.jwtVerify(token);
    let hasToken = await ctx.model.Jwt.findOne({
      value: token
    });
    if (!hasToken) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let user = await ctx.model.User.findById(hasToken.user);
    if (!user) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let dayjs = require('dayjs');
    let refleshRange = dayjs(hasToken.expAt).diff(dayjs(), 'second');
    if (refleshRange > 0 && refleshRange <= 600) {
      let newToken = await this.sign(user);
      ctx.set({
        refleshRange,
        refleshtoken: newToken.value,
        tokenexp: newToken.expAt
      });
    }
    return user;
  }
  async reflesh() {
    const {
      ctx
    } = this;
    let {
      header,
      body,
    } = ctx.request;
    let token = header.authorization || body.token;
    let hasToken = await ctx.model.Jwt.findOne({
      value: token
    });
    if (!hasToken) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let dayjs = require('dayjs');
    let refleshRange = dayjs(hasToken.expAt).diff(dayjs(), 'second');
    if (refleshRange > 0 && refleshRange <= 600) {
      let user = await ctx.helper.jwtVerify(token);
      return await this.sign(user);
    }
    return {
      refleshRange: refleshRange,
      value: hasToken.value,
      expAt: hasToken.expAt
    };
  }
}
module.exports = jwtService;