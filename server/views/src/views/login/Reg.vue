<template>
  <div style="postion:relative" v-loading="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
    <div>
      <div class="flex ac my-label">
        <div>
          手机号*
        </div>
        <div class="f1"></div>
        <div class="pointer">
          <!-- 我想登录 -->
        </div>
      </div>
      <mu-text-field name="username" @focus="cancelMobileError" @blur="vd" v-model="mobile" :errorText="mobileError" fullWidth hintText="" />
    </div>
    <div>
      <div class="flex ac my-label">
        <div>
          验证码*
        </div>
        <div class="f1"></div>
        <div class="pointer" style="color:#4FC3F7">
          获取验证码
        </div>
      </div>
      <mu-text-field name="password" @focus="cancelCodeError" @blur="vd" v-model="code" :errorText="codeError" fullWidth hintText="" />
    </div>
    <div>
      <div class="flex ac my-label">
        <div>
          密码*
        </div>
      </div>
      <mu-text-field name="password" @focus="cancelPswError" @blur="vd" v-model="password" :errorText="pswError" type="password" fullWidth hintText="" />
    </div>
    <div style="margin-top:10px">
      <div class="login-btn" @click="login">立即注册</div>
    </div>
    <div style="margin-top:20px;font-size:13px" class="flex ac">
      <div class="pointer" style="color:#7e848c">第三方登录</div>
      <div class="f1"></div>
      <div @click="$emit('change','Login')" class="pointer" style="color:#ff9a9e">我想登录</div>
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
        password: "",
        code:"",
        mobileError: "",
        pswError: "",
        codeError: "",
      };
    },
    methods: {
      cancelMobileError() {
        this.mobileError = "";
      },
      cancelPswError() {
        this.pswError = "";
      },
      cancelCodeError() {
        this.codeError = "";
      },
      vd() {
        if (!this.mobile) {
          this.mobileError = "手机号必填";
          return;
        }
        var reg = /^1[345789][0-9]{9}$/;
        if (!reg.test(this.mobile)) {
          this.mobileError = "手机号格式错误";
          return;
        }
        if (!this.code) {
          this.codeError = "验证码不能为空";
          return;
        }
        if (!this.password) {
          this.pswError = "密码不能为空";
          return;
        }
        if (this.password.length < 6) {
          this.pswError = "密码长度至少6位";
          return;
        }
        this.mobileError = "";
        this.codeError = "";
        this.pswError = "";
      },
      async login() {
        this.vd();
        if (!this.mobileError && !this.pswError) {
          this.loadingText = "正在登陆";
          try {
            await this.$api.login_local({
              username: this.mobile,
              password: md5(this.password)
            });
            this.loadingText = "";
          } catch (error) {
            setTimeout(() => {
              this.loadingText = "";
            }, 300);
          }
        }
      },
      closeBottomSheet() {
        this.bottomSheet = false;
      },
      sheetClick(item) {
        this.bottomSheet = false;
        if (item.href) {
          this.$loading({
            lock: true,
            text: `正在建立与${item.title}的连接`,
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          window.location.href = item.href;
        }
      }
    }
  };
</script>

<style scoped>
  .login-btn {
    color: #fff;
    background-image: linear-gradient( 45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    box-shadow: 0 0 10px #fad0c4;
    cursor: pointer;
    text-align: center;
    width: 100%;
    line-height: 40px;
    border-radius: 40px;
  }
  .my-label {
    font-size: 10px;
    color: #7e848c
  }
</style>