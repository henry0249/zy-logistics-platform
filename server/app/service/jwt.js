const Service = require('egg').Service;
const exp = Math.floor(Date.now() / 1000) + (2 * 60 * 60);

class jwtService extends Service {
  async sign(user) {
    const {
      ctx
    } = this;
    let token = await ctx.helper.jwtSign(user, exp);
    let uaObj = ctx.helper.ua();
    let tokenData = await ctx.model.Jwt.findOne({
      user: user._id
    });
    if (tokenData) {
      await tokenData.update({
        ...token,
        $addToSet: {
          info: uaObj
        },
        loginAt: new Date()
      })
    } else {
      let newTokenData = new ctx.model.Jwt({
        ...token,
        user: user._id,
        loginAt: new Date()
      })
      await newTokenData.save();
      await newTokenData.update({
        $addToSet: {
          info: uaObj
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
    await ctx.helper.jwtVerify(token)
    let hasToken = await ctx.model.Jwt.findOne({
      value: token
    })
    if (!hasToken) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let user = await ctx.model.User.findById(hasToken.user)
    if (!user) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
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
      refleshRange:refleshRange,
      value: hasToken.value,
      expAt: hasToken.expAt
    };
  }
}
module.exports = jwtService;