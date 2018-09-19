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
    }]);
    if (!tokenData) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
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
    if (refleshRange > 0 && refleshRange <= 60 * 60) {
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