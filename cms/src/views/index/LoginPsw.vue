<template>
  <div style="position:relative" class="col-flex jc" v-loading="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
    <div>
      <div style="color:#aaa;font-size:13px">手机号*</div>
      <div>
        <input @keyup.enter="login" v-model="mobile" class="my-input" type="text">
      </div>
    </div>
    <div style="padding-top:20px">
      <div class="flex ac">
        <div style="color:#aaa;font-size:13px">密码*</div>
        <div class="f1"></div>
        <div v-if="password" @click="showPsw = !showPsw" class="pointer" style="color:#546E7A;">
          <icon size="16">{{showPsw?'e1':'eed'}}</icon>
        </div>
      </div>
      <div>
        <input @keyup.enter="login" :type="showPsw?'text':'password'" v-model="password" class="my-input">
      </div>
    </div>
    <div style="padding-top:30px;width:100%">
      <div v-ripple class="login-btn" @click="login">立即登录</div>
      <div class="flex ac" style="padding-top:30px;color:#aaa;font-size:13px">
        <div class="pointer" @click="$message.info('即将开放')">第三方登录</div>
        <div class="f1"></div>
        <div class="pointer" style="color:#EF9A9A" @click="$router.push('/login/resetPsw')">重设密码</div>
      </div>
    </div>
    <div class="reg-tip triangle-topright">
    </div>
    <div class="reg-tip reg-tip-text" @click="$router.push('/login/reg')">
      注册
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
      sendSmsInterval: 0,
      sheet: false,
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
      if (!this.password) {
        this.$message.error("密码不能为空");
        return false;
      }
      if (this.password.length < 6) {
        this.$message.error("密码长度至少6位");
        return false;
      }
      this.loadingText = "正在登录";
      try {
        let res = await this.$api.login_local({
          username: this.mobile,
          password: md5(this.password),
          sys: "cms"
        });
        this.$store.commit("setToken", res);
        this.$router.push("/order");
        this.loadingText = "";
        this.$store.commit("headerToggle", true);
      } catch (error) {
        this.loadingText = "";
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
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