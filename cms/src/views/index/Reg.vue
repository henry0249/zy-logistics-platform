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
          <icon size="15">yanzhengma</icon>
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
    <div style="padding-top:20px">
      <div class="flex ac">
        <div style="color:#aaa">密码*</div>
        <div class="f1"></div>
        <div v-if="password" @click="showPsw = !showPsw" class="pointer" style="color:#546E7A;">
          <icon size="16">{{showPsw?'e1':'eed'}}</icon>
        </div>
      </div>
      <div>
        <input :type="showPsw?'text':'password'" v-model="password" class="my-input">
      </div>
    </div>
    <div style="padding-top:30px;width:100%">
      <div v-ripple class="login-btn" @click="reg">立即注册</div>
    </div>
    <div class="reg-tip triangle-topright">
    </div>
    <div class="reg-tip reg-tip-text" @click="$router.push('/login/psw')">
      登录
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      loadingText: "",
      mobile: "",
      code: "",
      psw: "",
      password: "",
      showPsw: false,
      sendSmsInterval: 0
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
      try {
        let sendRes = await this.$api.sendSms({
          mobile: this.mobile
        });
        this.$message.success("发送成功");
        this.sendSmsInterval = 60;
        this.loadingText = "";
      } catch (error) {
        this.loadingText = "";
      }
    },
    async reg() {
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
      if (!this.password) {
        this.$message.error("密码不能为空");
        return false;
      }
      if (this.password.length < 6) {
        this.$message.error("密码长度至少6位");
        return false;
      }
      this.loadingText = "正在注册";
      try {
        await this.$api.register_phone({
          mobile: this.mobile,
          code: this.code,
          password: md5(this.password)
        });
        this.$message.success("注册成功");
        this.$router.push("/login/psw");
        this.loadingText = "";
      } catch (error) {
        this.loadingText = "";
      }
    }
  }
};
</script>

<style scoped>
.my-input {
  outline: none;
  padding-top: 10px;
  padding-bottom: 2px;
  width: 200px;
   border: none;
  border-bottom: 1px solid #eee;
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