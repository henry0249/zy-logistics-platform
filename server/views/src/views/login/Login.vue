<template>
  <div style="postion:relative" v-loading="loadingText" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
    <div>
      <div class="flex ac my-label">
        <div>
          手机号*
        </div>
        <div class="f1"></div>
        <div class="pointer">
          <!-- 还没有账号? -->
        </div>
      </div>
      <mu-text-field name="username" @focus="cancelMobileError" @blur="vd" v-model="mobile" :errorText="mobileError" fullWidth hintText="" />
    </div>
    <div>
      <div class="flex ac my-label">
        <div>
          密码*
        </div>
        <div class="f1"></div>
        <div class="pointer">
          忘记密码?
        </div>
      </div>
      <mu-text-field name="password" @focus="cancelPswError" @blur="vd" v-model="password" :errorText="pswError" type="password" fullWidth hintText="" />
    </div>
    <div style="margin-top:10px">
      <div class="login-btn" @click="login">立即登录</div>
    </div>
    <div style="margin-top:20px;font-size:13px" class="flex ac">
      <div class="pointer" style="color:#7e848c" @click="bottomSheet = !bottomSheet">第三方登录</div>
      <div class="f1"></div>
      <div class="pointer" @click="$emit('change','Reg')" style="color:#ff9a9e">手机号注册</div>
    </div>
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-list>
        <mu-sub-header>
          请选择一个您常用的登录方式
        </mu-sub-header>
        <mu-list-item @click="sheetClick(item)" v-for="item in tiles" :key="item.id">
          <div class="flex ac">
            <img :src="item.img" style="width:25px;margin:0 10px;height:auto" :style="item.style" :alt="item.title">
            <div>{{item.title}}</div>
          </div>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
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
        mobileError: "",
        pswError: "",
        bottomSheet: false,
        tiles: [{
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-%E5%BE%AE%E4%BF%A1.png",
            title: "微信"
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-1b5b65183acb4566a5a4c639fc8cc1f3.png",
            title: "钉钉",
            style: {
              width: "23.5px"
            }
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-8f18b4ec7aaed05e0beb66af005fce92.png",
            title: "QQ",
            style: {
              width: "20px",
              marginRight: "14px"
            }
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-02-%E6%B7%98%E5%AE%9D.png",
            title: "淘宝"
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-social-weibo.png",
            title: "微博"
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-github-2.png",
            title: "github",
            href: "/passport/github"
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-twitter.png",
            title: "twitter"
          },
          {
            img: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-05-01-google_plus.png",
            title: "google+"
          }
        ]
      };
    },
    methods: {
      cancelMobileError() {
        this.mobileError = "";
      },
      cancelPswError() {
        this.pswError = "";
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
        if (!this.password) {
          this.pswError = "密码不能为空";
          return;
        }
        if (this.password.length < 6) {
          this.pswError = "密码长度至少6位";
          return;
        }
        this.mobileError = "";
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
    },
    mounted(){
      console.log(location.origin);
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