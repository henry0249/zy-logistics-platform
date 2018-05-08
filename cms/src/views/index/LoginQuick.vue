<template>
  <div style="position:relative" class="col-flex jc" v-loading="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
    <div>
      <div style="color:#aaa">手机号*</div>
      <div>
        <input v-model="mobile" class="my-input" type="text">
      </div>
    </div>
    <div style="padding-top:20px">
      <div class="flex ac">
        <div style="color:#aaa">验证码*</div>
        <div class="f1"></div>
        <div class="ac pointer" v-ripple style="border-radius:30px;color:#64B5F6;padding:3px 5px">
          <i style="font-size:16px" class="material-icons">message</i>
          <div v-if="sendSmsInterval===0" @click="sendSms">获取验证码</div>
          <div style="cursor: not-allowed" v-if="sendSmsInterval>0">
            {{sendSmsInterval}}秒后获取
          </div>
        </div>
      </div>
      <div>
        <input v-model="code" class="my-input" type="text">
      </div>
    </div>
    <div style="padding-top:30px;width:100%">
      <div v-ripple class="login-btn" @click="login">快速登录</div>
      <div class="flex" style="padding-top:30px;color:#aaa;font-size:13px">
        <div class="pointer" @click="sheet=!sheet">第三方登录</div>
        <div class="f1"></div>
        <div class="pointer" @click="$router.push('/login/psw')">密码登录</div>
      </div>
    </div>
    <div class="reg-tip triangle-topright">
    </div>
    <div class="reg-tip reg-tip-text" @click="$router.push('/login/reg')">
      注册
    </div>
    <v-dialog v-model="dialog" persistent max-width="280">
      <v-card style="background:#fff">
        <v-card-title class="headline">是否使用此手机号快速注册并登录?</v-card-title>
        <v-card-text style="color:#757575">此手机号还未注册,可使用验证码快速登录,登录后设置密码可使用密码登录</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat @click.native="dialog = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click.native="quickReg">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-subheader>选择登录方式</v-subheader>
        <v-list-tile v-for="tile in tiles" :key="tile.title" @click="sheet = false">
          <!-- <v-list-tile-avatar> -->
            <!-- <v-avatar size="30px" tile> -->
              <img :src="tile.img" style="width:25px;margin:0 10px;height:auto" :style="tile.style" :alt="tile.title">
            <!-- </v-avatar> -->
          <!-- </v-list-tile-avatar> -->
          <v-list-tile-title>{{ tile.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingText: "",
      mobile: "",
      code: "",
      psw: "",
      sendSmsInterval: 0,
      dialog: false,
      sheet: false,
      tiles: [
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-%E5%BE%AE%E4%BF%A1.png", title: "微信" ,style:{width:'24px'}},
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-1b5b65183acb4566a5a4c639fc8cc1f3.png", title: "钉钉",style:{width:'24px'} },
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-8f18b4ec7aaed05e0beb66af005fce92.png", title: "QQ" ,style:{width:'20px'}},
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-social-weibo.png", title: "微博" },
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-github-2.png", title: "github" },
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-twitter.png", title: "twitter" },
        { img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-google_plus.png", title: "google+" }
      ]
    };
  },
  watch: {
    sendSmsInterval(val) {
      if (val !== 0) {
        setTimeout(() => {
          this.sendSmsInterval--;
        }, 1000);
      }
    }
  },
  methods: {
    async sendSms() {
      if (!this.mobile) {
        this.$message.warn("请先填写手机号");
        return false;
      }
      var reg = /^1[345789][0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.$message.error("手机号格式错误");
        return false;
      }
      this.loadingText = "发送中";
      let sendRes = await this.$api.sendSms({
        mobile: this.mobile
      });
      if (sendRes) {
        this.$message.success("发送成功");
      }
      this.sendSmsInterval = 60;
      this.loadingText = "";
    },
    async login() {
      if (!this.mobile) {
        this.$message.warn("请先填写手机号");
        return false;
      }
      var reg = /^1[345789][0-9]{9}$/;
      if (!reg.test(this.mobile)) {
        this.$message.error("手机号格式错误");
        return false;
      }
      if (!this.code) {
        this.$message.error("验证码不能为空");
        return false;
      }
      this.loadingText = "正在检查验证码";
      let vdRes = await this.$api.vdSms({
        mobile: this.mobile,
        code: this.code
      });
      this.loadingText = "";
      if (!vdRes) {
        return false;
      }
      if (vdRes.token) {
        this.$store.commit("setUserInfo", vdRes);
        this.$message.success("登录成功");
        if (this.$route.query && this.$route.query.to) {
          this.$router.push(this.$route.query.to);
        }
        this.$router.push("/home");
      } else {
        this.dialog = true;
      }
    },
    async quickReg() {
      this.dialog = false;
      this.loadingText = "快速登录中";
      let res = await this.$api.quickReg({
        mobile: this.mobile,
        code: this.code
      });
      this.loadingText = "";
      if (!res) {
        return false;
      }
      this.$store.commit("setUserInfo", res);
      this.$message.success("登录成功");
      if (this.$route.query && this.$route.query.to) {
        this.$router.push(this.$route.query.to);
      }
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped>
.my-input {
  outline: none;
  padding-top: 10px;
  padding-bottom: 2px;
  border-bottom: 1px solid #aaa;
  width: 200px;
}
.my-input:focus {
  border-bottom: 1px solid #42a5f5;
}
.login-btn {
  color: #fff;
  background-image: linear-gradient(
    45deg,
    #ff9a9e 0%,
    #fad0c4 99%,
    #fad0c4 100%
  );
  box-shadow: 0 0 10px #fad0c4;
  cursor: pointer;
  text-align: center;
  width: 100%;
  line-height: 40px;
  border-radius: 40px;
}
.triangle-topright {
  width: 0;
  height: 0;
  border-top: 50px solid #ff9a9e;
  border-left: 50px solid transparent;
}
.reg-tip {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
.reg-tip-text {
  top: 5px;
  right: 2px;
  color: #fff;
  transform: rotate(45deg);
}
</style>