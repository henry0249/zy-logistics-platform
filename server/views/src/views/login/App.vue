<template>
  <div class="g-login  col-flex jc" v-bg-img="bgImg">
    <div class="g-login-box elevation-24">
      <div class="flex">
        <div class="box-img">
          <img :src="boxImg" alt="">
          <div style="padding-left:4px">
            <div style="padding-top:10px;font-size:20px">
              中源物流
            </div>
            <div style="margin-top:10px;margin-bottom:15px;width:20px;height:1px;background:#fff">
            </div>
          </div>
          <button v-ripple class="my-btn">一站式物流平台</button>
          <!-- <v-btn round outline color="white">一站式物流平台</v-btn> -->
        </div>
        <div class="col-flex" style="min-width:280px">
          <div class="col-flex jc" style="padding:20px 40px;flex:1">
            <component @change="change" style="width:100%" :is="component" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";
import Reg from "./Reg.vue";
export default {
  title: "中源方阵 - 登录",
  components: {
    Login,
    Reg
  },
  data() {
    return {
      component: "Login",
      bgImg:
        "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-04-25-500600773_banner.jpg",
      boxImg:
        "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-04-25-9619470c930836d7f3a9b9ff8136acb2.png"
    };
  },
  methods: {
    change(name) {
      this.component = name;
    }
  }
};
</script>

<style scoped>
.g-login {
  height: 100vh;
  width: 100vw;
}
.g-login-box {
  background: #fff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.box-img {
  color: #fff;
  padding: 50px 40px;
  background-image: linear-gradient(
    45deg,
    #ff9a9e 0%,
    #fad0c4 99%,
    #fad0c4 100%
  );
}
.box-img img {
  width: 200px;
}
.my-btn {
  background: none;
  color: #fff;
  border: 1px solid #ffffff;
  font-size: 14px;
  line-height: 30px;
  border-radius: 30px;
  outline: none;
}
</style>