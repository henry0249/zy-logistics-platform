const Service = require('egg').Service;

class jwtService extends Service {
  async sign(user, exp = Math.floor(Date.now() / 1000) + (2 * 60 * 60)) {
    const {
      ctx
    } = this;
    let token = await ctx.helper.jwtSign(user, exp);
    let uaObj = ctx.helper.ua();
    let tokenData = await ctx.model.Jwt.findOne({
      user: user._id
    })
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
    return user
  }
  async reflesh(){
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
    })
    if (!hasToken) {
      ctx.throw(401, '您长时间没有操作系统,请重新登录');
    }
    let dayjs = require('dayjs');
    let refleshTimeRange = dayjs(hasToken.expAt).diff(dayjs(),'minute');
    return refleshTimeRange
  }
}
module.exports = jwtService;